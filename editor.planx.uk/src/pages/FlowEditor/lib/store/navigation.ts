import { TYPES } from "@planx/components/types";
import { hasFeatureFlag } from "lib/featureFlags";
import { findLast, pick } from "lodash";
import { Store } from "pages/FlowEditor/lib/store";
import type { StateCreator } from "zustand";

import { SharedStore } from "./shared";

export interface SectionNode extends Store.node {
  data: {
    title: string;
  };
}

export interface NavigationStore {
  currentSectionIndex: number;
  sectionCount: number;
  currentSectionTitle?: string;
  hasSections: boolean;
  sectionNodes: Record<string, SectionNode>;
  initNavigationStore: () => void;
  updateSectionData: () => void;
  filterFlowByType: (type: TYPES) => Store.flow;
  getSortedBreadcrumbsBySection: () => Store.breadcrumbs[];
}

export const navigationStore: StateCreator<
  NavigationStore & SharedStore,
  [],
  [],
  NavigationStore
> = (set, get) => ({
  currentSectionIndex: 1,

  sectionCount: 0,

  currentSectionTitle: undefined,

  hasSections: false,

  sectionNodes: {},

  /**
   * Set up initial values to populate store
   * Called by setFlow() as we require a flow from the DB before proceeding
   */
  initNavigationStore: () => {
    const sectionNodes = get().filterFlowByType(TYPES.Section) as Record<
      string,
      SectionNode
    >;
    const sectionCount = Object.keys(sectionNodes).length;
    const hasSections = Boolean(
      sectionCount && hasFeatureFlag("NAVIGATION_UI")
    );
    const currentSectionTitle = Object.values(sectionNodes)[0]?.data.title;

    set({
      sectionNodes,
      sectionCount,
      hasSections,
      currentSectionTitle,
    });
  },

  /**
   * Update title and index on record()
   * Triggered when going backewards, forwards, or changing answer
   */
  updateSectionData: () => {
    const { breadcrumbs, sectionNodes, hasSections } = get();
    // Sections not being used, do not proceed
    if (!hasSections) return;

    const breadcrumbIds = Object.keys(breadcrumbs);
    const sectionIds = Object.keys(sectionNodes);

    // Fallback to the first sectionId, which allows us to have a mostRecentSectionId on the first node ("Card") before it exists in breadcrumbs (eg "Continue" hasn't been clicked yet)
    const mostRecentSectionId =
      findLast(breadcrumbIds, (breadcrumbId: string) =>
        sectionIds.includes(breadcrumbId)
      ) || sectionIds[0];

    // Update section
    const currentSectionTitle = sectionNodes[mostRecentSectionId].data.title;
    const currentSectionIndex = sectionIds.indexOf(mostRecentSectionId) + 1;
    set({ currentSectionTitle, currentSectionIndex });
  },

  /**
   * Get a subset of the full flow, by type
   * Returned in correct order, based on _root node's edges
   */
  filterFlowByType: (type: TYPES): Store.flow => {
    const flow = get().flow;
    const rootEdges = flow._root.edges || [];
    const filteredFlow = Object.fromEntries(
      Object.entries(flow)
        .filter(([_key, value]) => value.type === type)
        .sort(([idA], [idB]) => rootEdges.indexOf(idA) - rootEdges.indexOf(idB))
    );
    return filteredFlow;
  },

  // if this flow has sections, split the breadcrumbs up by sections,
  //    so we can render section node titles as h2s and the following nodes as individual SummaryLists
  getSortedBreadcrumbsBySection: () => {
    const { breadcrumbs, sectionNodes, hasSections } = get();
    const sortedBreadcrumbsBySection: Store.breadcrumbs[] = [];
    if (hasSections) {
      const sortedNodeIdsBySection: string[][] = [];
      Object.keys(sectionNodes).forEach((sectionId, i) => {
        const nextSectionId: string = Object.keys(sectionNodes)[i + 1];
        const isLastSection: boolean =
          Object.keys(sectionNodes).pop() === sectionId;

        // get the nodeIds in order for each section, where the first nodeId in an array should always be a section type
        sortedNodeIdsBySection.push(
          Object.keys(breadcrumbs).slice(
            Object.keys(breadcrumbs).indexOf(sectionId),
            isLastSection
              ? undefined
              : Object.keys(breadcrumbs).indexOf(nextSectionId)
          )
        );
      });

      // chunk the breadcrumbs based on the nodeIds in a given section
      sortedNodeIdsBySection.forEach((nodeIds) => {
        sortedBreadcrumbsBySection.push(pick(breadcrumbs, nodeIds));
      });
    }

    return sortedBreadcrumbsBySection;
  },
});
