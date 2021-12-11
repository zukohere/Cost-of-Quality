let data2 = {
    "nodes": [
      { "name": "Preventive (Design, Manufacture, etc.)" },
      { "name": "Inspect" },
      { "name": "Customer" },
      { "name": "Rework" },
      { "name": "Scrap" },
      { "name": "Good" },
      { "name": "Return" },
      { "name": "Field Scrap" }
    ],
    "links": [
      { "source": "Preventive (Design, Manufacture, etc.)", "target": "Inspect", "value": 20, "optimal": "yes" },
      
      { "source": "Inspect", "target": "Customer", "value": 20, "optimal": "yes" },
      { "source": "Inspect", "target": "Rework", "value": 20, "optimal": "no" },
      { "source": "Inspect", "target": "Scrap", "value": 15, "optimal": "yes" },

      { "source": "Rework", "target": "Inspect", "value": 15, "optimal": "yes" },
     
      { "source": "Customer", "target": "Good", "value": 30, "optimal": "yes" },
      { "source": "Customer", "target": "Field Scrap", "value": 10, "optimal": "yes" },
      
      { "source": "Customer", "target": "Return", "value": 35, "optimal": "yes" },
      { "source": "Return", "target": "Inspect", "value": 35, "optimal": "yes" }
      
    ]
  };