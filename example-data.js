var thickness = 20

let data2 = {
    "unitSales": 1000000,
    "copqGoal": 0.01,
    "cogqGoal": 0.02,
    "nodes": [
      { "name": "Product Development", "index": 0, "cost": 100, "COQ": "Prevention", "GorP": "COGQ"},
      { "name": "Raw/Receiving Inspection", "index": 0, "cost": 100, "COQ": "Appraisal", "GorP": "COGQ"},
      { "name": "Raw/Receiving Scrap", "index": 0, "cost": 100, "COQ": "Internal Failure", "GorP": "COPQ"},
      { "name": "Raw/Receiving Rework", "index": 0, "cost": 100, "COQ": "Internal Failure", "GorP": "COPQ"},
      { "name": "Manufacture", "index": 0 , "cost": 300, "COQ": "Prevention", "GorP": "COGQ"},
      { "name": "Manufacturing Inspect", "index": 1 , "cost": 50, "COQ": "Appraisal", "GorP": "COGQ"},
      { "name": "Rework", "index": 1 , "cost": 80, "COQ": "Internal Failure", "GorP": "COPQ"},
      { "name": "Customer", "index": 2 , "cost": 175, "COQ": "Shipping", "GorP": "COGQ"},
      { "name": "Scrap" , "index": 4, "cost": 300, "COQ": "Internal Failure", "GorP": "COPQ"},
      { "name": "Good Quality" , "index": 4, "cost": 0, "COQ": "End User", "GorP": "COGQ"},
      { "name": "Return", "index": 6 , "cost": 120, "COQ": "External Failure", "GorP": "COPQ"},
      { "name": "Field Scrap", "index": 7 , "cost": 140, "COQ": "External Failure", "GorP": "COPQ"},
    ],
    "links": [
      { "source": "Product Development", "target": "Raw/Receiving Inspection", "value": thickness,"units": 100, "optimal": "yes", "level": 0},

      { "source": "Raw/Receiving Inspection", "target": "Raw/Receiving Scrap", "value": thickness,"units": 20, "optimal": "no", "level": 1},
      { "source": "Raw/Receiving Inspection", "target": "Raw/Receiving Rework", "value": thickness,"units": 20, "optimal": "no", "level": 1},
      { "source": "Raw/Receiving Inspection", "target": "Manufacture", "value": thickness,"units": 60, "optimal": "yes", "level": 1},
      
      { "source": "Raw/Receiving Rework", "target": "Raw/Receiving Scrap", "value": thickness,"units": 20, "optimal": "no", "level": 2},
      { "source": "Raw/Receiving Rework", "target": "Manufacture", "value": thickness,"units": 80, "optimal": "yes", "level": 2},
      

      { "source": "Manufacture", "target": "Manufacturing Inspect", "value": thickness,"units": 100, "optimal": "yes", "level": 3},

      { "source": "Manufacturing Inspect", "target": "Customer", "value": thickness,"units": 80, "optimal": "yes" , "level": 4},
      { "source": "Manufacturing Inspect", "target": "Rework", "value": thickness,"units": 10, "optimal": "no" , "level": 4},
      { "source": "Manufacturing Inspect", "target": "Scrap", "value": thickness,"units": 10, "optimal": "no" , "level": 4},

      { "source": "Rework", "target": "Customer", "value": thickness,"units": 75, "optimal": "yes" , "level": 5},
      { "source": "Rework", "target": "Scrap", "value": thickness,"units": 25, "optimal": "no" , "level": 5},

      { "source": "Customer", "target": "Good Quality", "value": thickness,"units": 80, "optimal": "yes" , "level": 6},
      { "source": "Customer", "target": "Field Scrap", "value": thickness,"units": 5, "optimal": "no" , "level": 6},
      { "source": "Customer", "target": "Return", "value": thickness,"units": 15, "optimal": "no" , "level": 6}

      // { "source": "Return", "target": "Manufacturing Inspect", "value": 100, "optimal": "yes" , "level": 6}
      
    ]
  };