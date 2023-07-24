// 2, WALLER ROAD, BEACONSFIELD, BUCKINGHAMSHIRE, HP9 2HE
// https://api.editor.planx.uk/gis/buckinghamshire?geom=POLYGON+%28%28-0.6332024931907679+51.60929241266979%2C+-0.6331099569797541+51.60907004020859%2C+-0.6330429017543818+51.60907920164237%2C+-0.633004009723666+51.60909086164631%2C+-0.6329812109470395+51.60910418736145%2C+-0.63296511769295+51.609116680215834%2C+-0.6329503655433681+51.60913000592336%2C+-0.6329154968261745+51.60917164873425%2C+-0.6328940391540554+51.609262429929544%2C+-0.6332024931907679+51.60929241266979%29%29&analytics=false&sessionId=f47f03be-8308-4b5c-b90d-71f6fdf392ce
export default {
  sourceRequest:
    "https://www.planning.data.gov.uk/entity.json?entries=current&geometry=POLYGON+%28%28-0.6332024931907679+51.60929241266979%2C+-0.6331099569797541+51.60907004020859%2C+-0.6330429017543818+51.60907920164237%2C+-0.633004009723666+51.60909086164631%2C+-0.6329812109470395+51.60910418736145%2C+-0.63296511769295+51.609116680215834%2C+-0.6329503655433681+51.60913000592336%2C+-0.6329154968261745+51.60917164873425%2C+-0.6328940391540554+51.609262429929544%2C+-0.6332024931907679+51.60929241266979%29%29&geometry_relation=intersects&limit=100&dataset=article-4-direction-area&dataset=central-activities-zone&dataset=listed-building&dataset=listed-building-outline&dataset=locally-listed-building&dataset=park-and-garden&dataset=conservation-area&dataset=area-of-outstanding-natural-beauty&dataset=national-park&dataset=world-heritage-site&dataset=world-heritage-site-buffer-zone&dataset=special-protection-area&dataset=scheduled-monument&dataset=tree&dataset=tree-preservation-order&dataset=tree-preservation-zone&dataset=site-of-special-scientific-interest&dataset=special-area-of-conservation&dataset=ancient-woodland",
  constraints: {
    article4: {
      fn: "article4",
      value: false,
      text: "is not subject to local permitted development restrictions (known as Article 4 directions)",
      category: "General policy",
    },
    listed: {
      fn: "listed",
      value: false,
      text: "is not, or is not within, a Listed Building",
      category: "Heritage and conservation",
    },
    locallyListed: {
      fn: "locallyListed",
      value: false,
      text: "is not, or is not within, a Locally Listed Building",
      category: "Heritage and conservation",
    },
    registeredPark: {
      fn: "registeredPark",
      value: false,
      text: "is not in a Historic Park or Garden",
      category: "Heritage and conservation",
    },
    "designated.conservationArea": {
      fn: "designated.conservationArea",
      value: false,
      text: "is not in a Conservation Area",
      category: "Heritage and conservation",
    },
    "designated.AONB": {
      fn: "designated.AONB",
      value: false,
      text: "is not in an Area of Outstanding Natural Beauty",
      category: "Heritage and conservation",
    },
    "designated.nationalPark": {
      fn: "designated.nationalPark",
      value: false,
      text: "is not in a National Park",
      category: "Heritage and conservation",
    },
    "designated.nationalPark.broads": {
      fn: "designated.nationalPark.broads",
      value: false,
    },
    "designated.WHS": {
      fn: "designated.WHS",
      value: false,
      text: "is not an UNESCO World Heritage Site",
      category: "Heritage and conservation",
    },
    "designated.SPA": {
      fn: "designated.SPA",
      value: false,
      text: "is not in a Special Protection Area (SPA)",
      category: "Heritage and conservation",
    },
    monument: {
      fn: "monument",
      value: false,
      text: "is not the site of a Scheduled Monument",
      category: "Heritage and conservation",
    },
    tpo: {
      fn: "tpo",
      value: false,
      text: "is not in a Tree Preservation Order (TPO) Zone",
      category: "Trees",
    },
    "nature.SSSI": {
      fn: "nature.SSSI",
      value: false,
      text: "is not a Site of Special Scientific Interest (SSSI)",
      category: "Ecology",
    },
    "nature.SAC": {
      fn: "nature.SAC",
      value: false,
      text: "is not in a Special Area of Conservation (SAC)",
      category: "Ecology",
    },
    "nature.ASNW": {
      fn: "nature.ASNW",
      value: false,
      text: "is not in an Ancient Semi-Natural Woodland (ASNW)",
      category: "Ecology",
    },
    "article4.buckinghamshire.caz": {
      fn: "article4.caz",
      value: false,
      text: "is not in the Central Activities Zone",
      category: "General policy",
    },
  },
  metadata: {
    article4: {
      "entry-date": "",
      "start-date": "",
      "end-date": "",
      collection: "article-4-direction",
      dataset: "article-4-direction-area",
      description:
        "Orders made by the local planning authority to remove all or some of the permitted development rights on a site in order to protect it",
      name: "Article 4 direction area",
      plural: "Article 4 direction areas",
      prefix: "",
      text: "A local planning authority may create an [article 4 direction](https://www.gov.uk/guidance/when-is-permission-required#article-4-direction) to alter or remove [permitted development rights](https://www.gov.uk/government/publications/permitted-development-rights-for-householders-technical-guidance) from a building or area.\n\nEach [article 4 direction](/dataset/article-4-direction) may apply to one or more article 4 direction areas, each with one or more [article 4 direction rules](/dataset/article-4-direction-rule).\n\nThis dataset contains data from [a small group of local planning authorities](/about/) who we are working with to develop a [data specification for article 4 directions](https://www.digital-land.info/guidance/specifications/article-4-direction).",
      typology: "geography",
      wikidata: "",
      wikipedia: "",
      entities: "",
      themes: ["heritage"],
      "entity-count": {
        dataset: "article-4-direction-area",
        count: 1351,
      },
      "paint-options": "",
      attribution: "crown-copyright",
      "attribution-text": "© Crown copyright and database right 2023",
      licence: "ogl3",
      "licence-text":
        "Licensed under the [Open Government Licence v.3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).",
    },
    "article4.caz": {
      "entry-date": "",
      "start-date": "",
      "end-date": "",
      collection: "central-activities-zone",
      dataset: "central-activities-zone",
      description: "",
      name: "Central activities zone",
      plural: "Central activities zones",
      prefix: "",
      text: "The [Greater London Authority](https://www.london.gov.uk/) (GLA) designates a central area of London with [implications for planning](https://www.london.gov.uk/what-we-do/planning/implementing-london-plan/london-plan-guidance-and-spgs/central-activities-zone)\nThis dataset combines data provided by the GLA with the boundary from the individual London boroughs.",
      typology: "geography",
      wikidata: "",
      wikipedia: "",
      entities: "",
      themes: ["development"],
      "entity-count": {
        dataset: "central-activities-zone",
        count: 10,
      },
      "paint-options": "",
      attribution: "crown-copyright",
      "attribution-text": "© Crown copyright and database right 2023",
      licence: "ogl3",
      "licence-text":
        "Licensed under the [Open Government Licence v.3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).",
    },
    listed: {
      "entry-date": "",
      "start-date": "",
      "end-date": "",
      collection: "listed-building",
      dataset: "listed-building-outline",
      description: "boundary of a listed building",
      name: "Listed building outline",
      plural: "Listed building outlines",
      prefix: "",
      text: "The geospatial boundary for [listed buildings](https://historicengland.org.uk/listing/what-is-designation/listed-buildings) as designated by [Historic England](https://historicengland.org.uk/) as collected from local planning authorities.\n\nWe are [working with a group of local planning authorities](/about/) to help them publish their data to inform planning decisions, and to develop a [data specification for listed building outlines](https://www.digital-land.info/guidance/specifications/listed-building).\n\nWe expect to eventually merge this dataset with the [listed building](/dataset/listed-building) dataset.",
      typology: "geography",
      wikidata: "Q570600",
      wikipedia: "Listed_building",
      entities: "",
      themes: ["heritage"],
      "entity-count": {
        dataset: "listed-building-outline",
        count: 12237,
      },
      "paint-options": {
        colour: "#F9C744",
      },
      attribution: "crown-copyright",
      "attribution-text": "© Crown copyright and database right 2023",
      licence: "ogl3",
      "licence-text":
        "Licensed under the [Open Government Licence v.3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).",
    },
    locallyListed: {
      "entry-date": "",
      "start-date": "",
      "end-date": "",
      collection: "listed-building",
      dataset: "locally-listed-building",
      description: "locally listed heritage assets, including buildings",
      name: "Locally listed building",
      plural: "Locally listed buildings",
      prefix: "",
      text: "A building or site in a local planning authority’s area that make a positive contribution to its local character and sense of place because of their heritage value. Although such heritage assets may not be nationally designated or even located within the boundaries of a conservation area, they may be offered some level of protection by the local planning authority identifying them on a formally adopted list of local heritage assets.\n\nThis is an experimental dataset of locally listed buildings found on [data.gov.uk](https://www.data.gov.uk/search?q=locally+listed+buildings).\nWe are [working with a group of local planning authorities](/about/) to help them publish their locally listed buildings, and to develop a data specification for locally listed buildings.",
      typology: "geography",
      wikidata: "Q570600",
      wikipedia: "Listed_building#Locally_listed_buildings",
      entities: "",
      themes: ["heritage"],
      "entity-count": {
        dataset: "locally-listed-building",
        count: 448,
      },
      "paint-options": {
        colour: "#F9C744",
      },
      attribution: "crown-copyright",
      "attribution-text": "© Crown copyright and database right 2023",
      licence: "ogl3",
      "licence-text":
        "Licensed under the [Open Government Licence v.3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).",
    },
    registeredPark: {
      "entry-date": "",
      "start-date": "",
      "end-date": "",
      collection: "historic-england",
      dataset: "park-and-garden",
      description: "",
      name: "Historic parks and gardens",
      plural: "Parks and gardens",
      prefix: "",
      text: "Historic parks and gardens as listed by [Historic England](https://historicengland.org.uk/) in the [Register of Parks and Gardens of Special Historic Interest](https://historicengland.org.uk/listing/what-is-designation/registered-parks-and-gardens/).",
      typology: "geography",
      wikidata: "Q6975250",
      wikipedia:
        "Register_of_Historic_Parks_and_Gardens_of_Special_Historic_Interest_in_England",
      entities: "",
      themes: ["environment", "heritage"],
      "entity-count": {
        dataset: "park-and-garden",
        count: 1699,
      },
      "paint-options": {
        colour: "#0EB951",
      },
      attribution: "historic-england",
      "attribution-text":
        "© Historic England 2023. Contains Ordnance Survey data © Crown copyright and database right 2023.\nThe Historic England GIS Data contained in this material was obtained on [date].\nThe most publicly available up to date Historic England GIS Data can be obtained from [HistoricEngland.org.uk](https://historicengland.org.uk).",
      licence: "ogl3",
      "licence-text":
        "Licensed under the [Open Government Licence v.3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).",
    },
    "designated.conservationArea": {
      "entry-date": "",
      "start-date": "",
      "end-date": "",
      collection: "conservation-area",
      dataset: "conservation-area",
      description:
        "Special architectural or historic interest, the character or appearance of which it is desirable to preserve or enhance",
      name: "Conservation area",
      plural: "Conservation areas",
      prefix: "",
      text: "Local planning authorities are responsible for designating conservation areas, though [Historic England](https://historicengland.org.uk/) and the Secretary of State also have powers to create them.\n\nThis dataset also contains the boundaries of conservation areas from Historic England, as well as other data found on [data.gov.uk](https://www.data.gov.uk/search?q=conservation+area) and currently contains a number of duplicate areas we are working to remove.\n\nWe are also [working with a group of local planning authorities](/about/) to help them publish their conservation areas, and to develop a [data specification for conservation areas](https://www.digital-land.info/guidance/specifications/conservation-area).\n\nHistoric England provide [guidance](https://historicengland.org.uk/advice/your-home/owning-historic-property/conservation-area/) to help householders understand the implications of living in a conservation area for planning applications.",
      typology: "geography",
      wikidata: "Q5162904",
      wikipedia: "Conservation_area_(United_Kingdom)",
      entities: "",
      themes: ["heritage"],
      "entity-count": {
        dataset: "conservation-area",
        count: 8600,
      },
      "paint-options": {
        colour: "#78AA00",
      },
      attribution: "historic-england",
      "attribution-text":
        "© Historic England 2023. Contains Ordnance Survey data © Crown copyright and database right 2023.\nThe Historic England GIS Data contained in this material was obtained on [date].\nThe most publicly available up to date Historic England GIS Data can be obtained from [HistoricEngland.org.uk](https://historicengland.org.uk).",
      licence: "ogl3",
      "licence-text":
        "Licensed under the [Open Government Licence v.3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).",
    },
    "designated.AONB": {
      "entry-date": "",
      "start-date": "",
      "end-date": "",
      collection: "area-of-outstanding-natural-beauty",
      dataset: "area-of-outstanding-natural-beauty",
      description:
        "Land protected by law to conserve and enhance its natural beauty",
      name: "Area of outstanding natural beauty",
      plural: "Areas of outstanding natural beauty",
      prefix: "",
      text: "An area of outstanding natural beauty (AONB) as designated by [Natural England](https://www.gov.uk/government/organisations/natural-england).\n\nNatural England provides [guidance](https://www.gov.uk/guidance/protected-sites-and-areas-how-to-review-planning-applications) to help local authorities decide on planning applications in protected sites and areas.",
      typology: "geography",
      wikidata: "Q174945",
      wikipedia: "Area_of_Outstanding_Natural_Beauty",
      entities: "",
      themes: ["environment"],
      "entity-count": {
        dataset: "area-of-outstanding-natural-beauty",
        count: 34,
      },
      "paint-options": {
        colour: "#d53880",
      },
      attribution: "natural-england",
      "attribution-text":
        "© Natural England copyright. Contains Ordnance Survey data © Crown copyright and database right 2023.",
      licence: "ogl3",
      "licence-text":
        "Licensed under the [Open Government Licence v.3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).",
    },
    "designated.nationalPark": {
      "entry-date": "",
      "start-date": "",
      "end-date": "",
      collection: "national-park",
      dataset: "national-park",
      description: "",
      name: "National park",
      plural: "National parks",
      prefix: "statistical-geography",
      text: "The administrative boundaries of [national park authorities](/dataset/national-park-authority) in England as provided by the ONS for the purposes of producing statistics.",
      typology: "geography",
      wikidata: "Q60256727",
      wikipedia: "National_park",
      entities: "",
      themes: ["heritage"],
      "entity-count": {
        dataset: "national-park",
        count: 10,
      },
      "paint-options": {
        colour: "#3DA52C",
      },
      attribution: "ons-boundary",
      "attribution-text":
        "Source: Office for National Statistics licensed under the Open Government Licence v.3.0\nContains OS data © Crown copyright and database right 2023",
      licence: "ogl3",
      "licence-text":
        "Licensed under the [Open Government Licence v.3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).",
    },
    "designated.WHS": {
      "entry-date": "",
      "start-date": "",
      "end-date": "",
      collection: "historic-england",
      dataset: "world-heritage-site-buffer-zone",
      description: "",
      name: "World heritage site buffer zone",
      plural: "World heritage site buffer zones",
      prefix: "",
      text: "A [World Heritage Site](/dataset/world-heritage-site) may have a [buffer zone](https://whc.unesco.org/en/series/25/) with implications for planning.",
      typology: "geography",
      wikidata: "Q9259",
      wikipedia: "World_Heritage_Site",
      entities: "",
      themes: ["heritage"],
      "entity-count": {
        dataset: "world-heritage-site-buffer-zone",
        count: 8,
      },
      "paint-options": {
        colour: "#EB1EE5",
      },
      attribution: "historic-england",
      "attribution-text":
        "© Historic England 2023. Contains Ordnance Survey data © Crown copyright and database right 2023.\nThe Historic England GIS Data contained in this material was obtained on [date].\nThe most publicly available up to date Historic England GIS Data can be obtained from [HistoricEngland.org.uk](https://historicengland.org.uk).",
      licence: "ogl3",
      "licence-text":
        "Licensed under the [Open Government Licence v.3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).",
    },
    "designated.SPA": {
      "entry-date": "",
      "start-date": "",
      "end-date": "",
      collection: "special-protection-area",
      dataset: "special-protection-area",
      description: "",
      name: "Special protection area",
      plural: "Special protection areas",
      prefix: "",
      text: "[Special protection areas](https://naturalengland-defra.opendata.arcgis.com/maps/Defra::special-protection-areas-england/about) is an area designated \nfor the protection of birds and wildlife. This dataset is provided by [Natural England](https://www.gov.uk/government/organisations/natural-england).",
      typology: "geography",
      wikidata: "",
      wikipedia: "",
      entities: "",
      themes: ["environment"],
      "entity-count": {
        dataset: "special-protection-area",
        count: 88,
      },
      "paint-options": "",
      attribution: "natural-england",
      "attribution-text":
        "© Natural England copyright. Contains Ordnance Survey data © Crown copyright and database right 2023.",
      licence: "ogl3",
      "licence-text":
        "Licensed under the [Open Government Licence v.3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).",
    },
    monument: {
      "entry-date": "",
      "start-date": "",
      "end-date": "",
      collection: "historic-england",
      dataset: "scheduled-monument",
      description: "",
      name: "Scheduled monument",
      plural: "Scheduled monuments",
      prefix: "",
      text: "Historic buildings or sites such as Roman remains, burial mounds, castles, bridges, earthworks, the remains of deserted villages and industrial sites can be designated scheduled monuments by the Secretary of State for [Digital, Culture, Media and Sport](https://www.gov.uk/government/organisations/department-for-digital-culture-media-sport). \n\nThis list of scheduled monuments is kept and maintained by [Historic England](https://historicengland.org.uk/).",
      typology: "geography",
      wikidata: "Q219538",
      wikipedia: "Scheduled_monument",
      entities: "",
      themes: ["heritage"],
      "entity-count": {
        dataset: "scheduled-monument",
        count: 19935,
      },
      "paint-options": {
        colour: "#0F9CDA",
      },
      attribution: "historic-england",
      "attribution-text":
        "© Historic England 2023. Contains Ordnance Survey data © Crown copyright and database right 2023.\nThe Historic England GIS Data contained in this material was obtained on [date].\nThe most publicly available up to date Historic England GIS Data can be obtained from [HistoricEngland.org.uk](https://historicengland.org.uk).",
      licence: "ogl3",
      "licence-text":
        "Licensed under the [Open Government Licence v.3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).",
    },
    tpo: {
      "entry-date": "",
      "start-date": "",
      "end-date": "",
      collection: "tree-preservation-order",
      dataset: "tree-preservation-zone",
      description: "An area covered by a tree preservation order",
      name: "Tree preservation zone",
      plural: "Trees preservation zones",
      prefix: "",
      text: "A Tree Preservation Order (TPO) can be placed on single trees, groups of trees and even whole woodlands. Tree Preservation Orders are made by local planning authorities following [guidance](https://www.gov.uk/guidance/tree-preservation-orders-and-trees-in-conservation-areas) provided by the [Department for Levelling Up, Housing and Communities](https://www.gov.uk/government/organisations/department-for-levelling-up-housing-and-communities).\n\nEach [tree preservation order](/dataset/tree-preservation-order) may apply to a number of tree preservation order zones, and a number of individual [trees](/dataset/tree).\n\nThis dataset contains data from [a small group of local planning authorities](/about/) who we are working with to develop a [data specification for tree preservation orders](https://www.digital-land.info/guidance/specifications/tree-preservation-order).",
      typology: "geography",
      wikidata: "Q10884",
      wikipedia: "Tree",
      entities: "",
      themes: ["environment"],
      "entity-count": {
        dataset: "tree-preservation-zone",
        count: 13161,
      },
      "paint-options": "",
      attribution: "crown-copyright",
      "attribution-text": "© Crown copyright and database right 2023",
      licence: "ogl3",
      "licence-text":
        "Licensed under the [Open Government Licence v.3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).",
    },
    "nature.SSSI": {
      "entry-date": "",
      "start-date": "",
      "end-date": "",
      collection: "site-of-special-scientific-interest",
      dataset: "site-of-special-scientific-interest",
      description: "",
      name: "Site of special scientific interest",
      plural: "Sites of special scientific interest",
      prefix: "",
      text: "Sites of special scientific interest (SSSI) are nationally protected sites that have features such as wildlife or geology. \n\nSSSIs are designated by [Natural England](https://www.gov.uk/government/organisations/natural-england).\nThere is [guidance](https://www.gov.uk/guidance/protected-areas-sites-of-special-scientific-interest) to help local authorities decide on planning applications in protected SSSIs.",
      typology: "geography",
      wikidata: "Q422211",
      wikipedia: "Site_of_Special_Scientific_Interest",
      entities: "",
      themes: ["environment"],
      "entity-count": {
        dataset: "site-of-special-scientific-interest",
        count: 4128,
      },
      "paint-options": {
        colour: "#308fac",
      },
      attribution: "natural-england",
      "attribution-text":
        "© Natural England copyright. Contains Ordnance Survey data © Crown copyright and database right 2023.",
      licence: "ogl3",
      "licence-text":
        "Licensed under the [Open Government Licence v.3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).",
    },
    "nature.SAC": {
      "entry-date": "",
      "start-date": "",
      "end-date": "",
      collection: "special-area-of-conservation",
      dataset: "special-area-of-conservation",
      description: "",
      name: "Special area of conservation",
      plural: "Special areas of conservation",
      prefix: "",
      text: "Special areas of conservation (SACs) are area of land which have been designated by\n[DEFRA](https://www.gov.uk/government/organisations/department-for-environment-food-rural-affairs),\nwith advice from the [Joint Nature Conservation Committee](https://jncc.gov.uk/),\nto protect specific habitats and species.\n\nDEFRA and [Natural England](https://www.gov.uk/government/organisations/natural-england) publish\n[guidance](https://www.gov.uk/guidance/protected-sites-and-areas-how-to-review-planning-applications)\non how to review planning applications in protected sites and areas.",
      typology: "geography",
      wikidata: "Q1191622",
      wikipedia: "Special_Area_of_Conservation",
      entities: "",
      themes: ["environment"],
      "entity-count": {
        dataset: "special-area-of-conservation",
        count: 256,
      },
      "paint-options": {
        colour: "#7A8705",
      },
      attribution: "natural-england",
      "attribution-text":
        "© Natural England copyright. Contains Ordnance Survey data © Crown copyright and database right 2023.",
      licence: "ogl3",
      "licence-text":
        "Licensed under the [Open Government Licence v.3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).",
    },
    "nature.ASNW": {
      "entry-date": "",
      "start-date": "",
      "end-date": "",
      collection: "ancient-woodland",
      dataset: "ancient-woodland",
      description:
        "An area that’s been wooded continuously since at least 1600 AD",
      name: "Ancient woodland",
      plural: "Ancient woodlands",
      prefix: "",
      text: "An area designated as ancient woodland by Natural England.\n\nNatural England and Forestry Commission [Guidance](https://www.gov.uk/guidance/ancient-woodland-and-veteran-trees-protection-surveys-licences)  is used in planning decisions.",
      typology: "geography",
      wikidata: "Q3078732",
      wikipedia: "Ancient_woodland",
      entities: "",
      themes: ["environment"],
      "entity-count": {
        dataset: "ancient-woodland",
        count: 44355,
      },
      "paint-options": {
        colour: "#00703c",
        opacity: 0.2,
      },
      attribution: "natural-england",
      "attribution-text":
        "© Natural England copyright. Contains Ordnance Survey data © Crown copyright and database right 2023.",
      licence: "ogl3",
      "licence-text":
        "Licensed under the [Open Government Licence v.3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).",
    },
  },
};
