import { useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { visuallyHidden } from "@mui/utils";
import Card from "@planx/components/shared/Preview/Card";
import QuestionHeader from "@planx/components/shared/Preview/QuestionHeader";
import { SummaryListTable } from "@planx/components/shared/Preview/SummaryList";
import type { PublicProps } from "@planx/components/ui";
import { Feature } from "@turf/helpers";
import { publicClient } from "lib/graphql";
import find from "lodash/find";
import { useAnalyticsTracking } from "pages/FlowEditor/lib/analytics/provider";
import { useStore } from "pages/FlowEditor/lib/store";
import { handleSubmit } from "pages/Preview/Node";
import React from "react";

import type { SiteAddress } from "../FindProperty/model";
import { FETCH_BLPU_CODES } from "../FindProperty/Public";
import { ErrorSummaryContainer } from "../shared/Preview/ErrorSummaryContainer";
import type { PropertyInformation } from "./model";

export default Component;

function Component(props: PublicProps<PropertyInformation>) {
  const [passport, overrideAnswer] = useStore((state) => [
    state.computePassport(),
    state.overrideAnswer,
  ]);
  const { data: blpuCodes } = useQuery(FETCH_BLPU_CODES, {
    client: publicClient,
  });

  return passport.data?._address ? (
    <Presentational
      title={props.title}
      description={props.description}
      showPropertyTypeOverride={props.showPropertyTypeOverride}
      address={passport.data?._address}
      propertyType={passport.data?.["property.type"]}
      localAuthorityDistrict={
        passport.data?.["property.localAuthorityDistrict"]
      }
      titleBoundary={passport.data?.["property.boundary.title"]}
      blpuCodes={blpuCodes}
      overrideAnswer={overrideAnswer}
      handleSubmit={props.handleSubmit}
    />
  ) : (
    <Card>
      <ErrorSummaryContainer
        role="status"
        data-testid="error-summary-invalid-graph"
      >
        <Typography variant="h4" component="h2" gutterBottom>
          Invalid graph
        </Typography>
        <Typography variant="body2">
          Edit this flow so that "Property information" is positioned after
          "Find property"; an address is required to render.
        </Typography>
      </ErrorSummaryContainer>
    </Card>
  );
}

// Exported for tests
export interface PresentationalProps {
  title: string;
  description: string;
  showPropertyTypeOverride?: boolean;
  address?: SiteAddress;
  propertyType?: string[];
  localAuthorityDistrict?: string[];
  titleBoundary?: Feature;
  blpuCodes?: any;
  overrideAnswer: (fn: string) => void;
  handleSubmit?: handleSubmit;
}

const MapContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  width: "100%",
  maxWidth: "none",
  "& my-map": {
    width: "100%",
    height: "60vh",
  },
}));

// Export this component for testing visual presentation with mocked props
export function Presentational(props: PresentationalProps) {
  const {
    title,
    description,
    showPropertyTypeOverride,
    address,
    propertyType,
    localAuthorityDistrict,
    titleBoundary,
    blpuCodes,
    overrideAnswer,
    handleSubmit,
  } = props;
  const teamName = useStore((state) => state.teamName);
  const propertyDetails: PropertyDetail[] = [
    {
      heading: "Address",
      detail: address?.title,
    },
    {
      heading: "Postcode",
      detail: address?.postcode,
    },
    {
      heading: "Local planning authority",
      detail: localAuthorityDistrict?.join(", ") || teamName,
    },
    {
      heading: "Property type",
      detail:
        find(blpuCodes?.blpu_codes, { value: propertyType?.[0] })
          ?.description ||
        propertyType?.[0] ||
        "Unknown",
      fn: "property.type",
    },
  ];

  return (
    <Card handleSubmit={handleSubmit}>
      <QuestionHeader title={title} description={description} />
      <MapContainer>
        <p style={visuallyHidden}>
          A static map centred on the property address, showing the title
          boundary, often called the "blue-line" boundary in planning, of your
          site. This boundary is sourced from the Land Registry and displayed
          atop an Ordnance Survey basemap.
        </p>
        {/* @ts-ignore */}
        <my-map
          id="property-information-map"
          ariaLabelOlFixedOverlay="A static map of the property address"
          zoom={19.5}
          latitude={address?.latitude}
          longitude={address?.longitude}
          osProxyEndpoint={`${process.env.REACT_APP_API_URL}/proxy/ordnance-survey`}
          hideResetControl
          staticMode
          showCentreMarker
          markerLatitude={address?.latitude}
          markerLongitude={address?.longitude}
          // markerColor={team?.settings?.design?.color} // defaults to black
          geojsonData={JSON.stringify(titleBoundary)}
          geojsonColor="#0010A4"
          geojsonBuffer={30}
          osCopyright={`Basemap subject to Crown copyright and database rights ${new Date().getFullYear()} OS (0)100024857`}
          geojsonDataCopyright={`<a href="https://www.planning.data.gov.uk/dataset/title-boundary" target="_blank" style="color:#0010A4;">Title boundary</a> subject to Crown copyright and database rights ${new Date().getFullYear()} OS (0)100026316`}
          collapseAttributions={window.innerWidth < 500 ? true : undefined}
        />
      </MapContainer>
      {propertyDetails && (
        <PropertyDetails
          data={propertyDetails}
          showPropertyTypeOverride={showPropertyTypeOverride}
          overrideAnswer={overrideAnswer}
        />
      )}
    </Card>
  );
}

interface PropertyDetail {
  heading: string;
  detail: any;
  fn?: string;
}

interface PropertyDetailsProps {
  data: PropertyDetail[];
  showPropertyTypeOverride?: boolean;
  showChangeButton?: boolean;
  overrideAnswer: (fn: string) => void;
}

function PropertyDetails(props: PropertyDetailsProps) {
  const { data, showPropertyTypeOverride, overrideAnswer } = props;
  const filteredData = data.filter((d) => Boolean(d.detail));

  const { trackEvent } = useAnalyticsTracking();

  const handleOverrideAnswer = (fn: string) => {
    trackEvent({
      event: "backwardsNavigation",
      metadata: null,
      initiator: "change",
    });
    overrideAnswer(fn);
  };

  return (
    <SummaryListTable showChangeButton={true}>
      {filteredData.map(({ heading, detail, fn }: PropertyDetail) => (
        <React.Fragment key={heading}>
          <Box component="dt">{heading}</Box>
          <Box component="dd">{detail}</Box>
          <Box component="dd">
            {showPropertyTypeOverride && fn ? (
              <Link
                component="button"
                style={{ font: "inherit" }}
                onClick={(event) => {
                  event.stopPropagation();
                  // Specify the passport key (eg data.fn, data.val) that should be overwritten
                  handleOverrideAnswer(fn);
                }}
              >
                Change
                <span style={visuallyHidden}>
                  your {heading || "this value"}
                </span>
              </Link>
            ) : (
              ``
            )}
          </Box>
        </React.Fragment>
      ))}
    </SummaryListTable>
  );
}
