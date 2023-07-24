// LAMBETH PALACE, LAMBETH PALACE ROAD, LONDON, SE1 7JU
// https://api.editor.planx.uk/roads?usrn=21900829
export default {
  sourceRequest:
    "https://api.os.uk/features/v1/wfs?service=WFS&request=GetFeature&version=2.0.0&typeNames=Highways_RoadLink&outputFormat=GEOJSON&srsName=urn%3Aogc%3Adef%3Acrs%3AEPSG%3A%3A4326&count=1&filter=%0A++++%3Cogc%3AFilter%3E%0A++++++%3Cogc%3APropertyIsLike+wildCard%3D%22%25%22+singleChar%3D%22%23%22+escapeChar%3D%22%21%22%3E%0A++++++++%3Cogc%3APropertyName%3EFormsPartOf%3C%2Fogc%3APropertyName%3E%0A++++++++%3Cogc%3ALiteral%3E%25Street%23usrn21900829%25%3C%2Fogc%3ALiteral%3E%0A++++++%3C%2Fogc%3APropertyIsLike%3E%0A++++%3C%2Fogc%3AFilter%3E%0A++&",
  metadata: {
    "road.classified": {
      name: "Classified road",
      plural: "Classified roads",
    },
  },
  constraints: {
    "road.classified": {
      fn: "road.classified",
      value: true,
      text: "is on a Classified Road (Lambeth Palace Road - A Road)",
      data: [
        {
          type: "Feature",
          geometry: {
            type: "MultiLineString",
            coordinates: [
              [
                [51.49981331, -0.11683771],
                [51.49986254, -0.11686428],
                [51.4999603, -0.11684774],
                [51.50002833, -0.11683623],
                [51.50005332, -0.11683201],
              ],
            ],
          },
          properties: {
            GmlID: "Highways_RoadLink.102656",
            OBJECTID: 102656,
            ID: "osgb4000000031199613",
            Identifier: "http://data.os.uk/id/4000000031199613",
            InspireIDNamespace: "http://data.os.uk/",
            InspireIDLocalID: "4000000031199613",
            Fictitious: "false",
            RoadClassification: "A Road",
            RouteHierarchy: "A Road",
            FormOfWay: "Dual Carriageway",
            TrunkRoad: "false",
            PrimaryRoute: "false",
            RoadClassificationNumber: "A3036",
            RoadName1: "Lambeth Palace Road",
            RoadName1Lang: "null",
            RoadName2: "null",
            RoadName2Lang: "null",
            AlternateName1: "null",
            AlternateName1Lang: "null",
            AlternateName2: "null",
            AlternateName2Lang: "null",
            OperationalState: "Open",
            Provenance: "OS Urban And OS Height",
            Directionality: "inDirection",
            Length: "27.12",
            LengthUOM: "m",
            MatchStatus: "Matched",
            AlternateIdentifier: "5660_5308050179549",
            StartGradeSeparation: 0,
            EndGradeSeparation: 0,
            RoadStructure: "null",
            CycleFacility: "null",
            RoadWidth: "null",
            RoadWidthConfidenceLevel: "OS Urban And Full Extent",
            RoadWidthAverage: "15",
            RoadWidthMinimum: "13",
            NumberOfLanes1: null,
            NumberOfLanes1Direction: "null",
            NumberOfLanes1MinMax: "null",
            NumberOfLanes2: null,
            NumberOfLanes2Direction: "null",
            NumberOfLanes2MinMax: "null",
            NumberOfLanes3: null,
            NumberOfLanes3Direction: "null",
            NumberOfLanes3MinMax: "null",
            NumberOfLanes4: null,
            NumberOfLanes4Direction: "null",
            NumberOfLanes4MinMax: "null",
            ElevationGainInDir: "0.1",
            ElevationGainInOppDir: "0.1",
            FormsPartOf:
              "Road#osgb4000000030488647,Road#osgb4000000030943710,Street#usrn21900829,Street#usrn21998782",
            StartNode: "osgb4000000029968873",
            EndNode: "osgb5000005261651517",
            RelatedRoadArea: "osgb1000001769238935",
            BeginLifespanVersion: "4/19/2020",
            ValidForm: "null",
            ReasonForChange: "Modified Attributes",
            AlternateIdentifierScheme: "NSG Elementary Street Unit ID (ESU ID)",
            SHAPE_Length: 27.11897034,
          },
        },
      ],
      category: "General policy",
    },
  },
};
