let data2 = {
    "nodes": [
      { "name": "Preventive (Design)", "index": 0 },
      { "name": "Manufacture", "index": 0 },
      { "name": "Incoming Inspect", "index": 1 },
      { "name": "Manufacturing Inspect", "index": 1 },
      { "name": "Rework", "index": 1 },
      { "name": "Customer", "index": 2 },
      { "name": "Scrap" , "index": 4},
      { "name": "Good Quality" , "index": 4},
      { "name": "Return", "index": 6 },
      { "name": "Field Scrap", "index": 7 }
    ],
    "links": [
      { "source": "Preventive (Design)", "target": "Incoming Inspect", "value": 20, "optimal": "yes", "level": 0},

      { "source": "Incoming Inspect", "target": "Manufacture", "value": 20, "optimal": "yes", "level": 1},
      { "source": "Incoming Inspect", "target": "Scrap", "value": 20, "optimal": "yes", "level": 1},
      
      { "source": "Manufacture", "target": "Manufacturing Inspect", "value": 20, "optimal": "yes", "level": 2},

      { "source": "Manufacturing Inspect", "target": "Customer", "value": 20, "optimal": "yes" , "level": 3},
      { "source": "Manufacturing Inspect", "target": "Rework", "value": 20, "optimal": "no" , "level": 3},
      { "source": "Manufacturing Inspect", "target": "Scrap", "value": 15, "optimal": "yes" , "level": 3},

      { "source": "Rework", "target": "Manufacturing Inspect", "value": 20, "optimal": "no" , "level": 4},

      { "source": "Customer", "target": "Good Quality", "value": 20, "optimal": "no" , "level": 5},
      { "source": "Customer", "target": "Field Scrap", "value": 10, "optimal": "yes" , "level": 5},
      { "source": "Customer", "target": "Return", "value": 35, "optimal": "yes" , "level": 5},

      { "source": "Return", "target": "Manufacturing Inspect", "value": 35, "optimal": "yes" , "level": 6}
      
    ]
  };