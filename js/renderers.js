const fortLabelSmall = [{
  labelPlacement: "above-center",
  labelExpressionInfo: {
    value: "{FT_NAME}"
  },
  symbol: {
    type: "label-3d",
    symbolLayers: [{
      type: "text",
          
      material: {
        color: [0, 0, 0]
      },
      halo: {
        color: [255, 255, 255, 0.8],
        size: 1
      },
      font: {
        weight: "bold",
        family: "Raleway"
      },
      size: 8,   
    }],
    verticalOffset: {
      screenLength: 60,
      maxWorldLength: 500,
      minWorldLength: 20
    },
    callout: {
      type: "line",
      size: 1,
      color: [0, 0, 0],
      border: {
        color: [255, 255, 255, 0]
      }
    }
  }
}]

const fortLabelLarge = [{
  labelPlacement: "above-center",
  labelExpressionInfo: {
    value: "{FT_NAME}"
  },
  symbol: {
    type: "label-3d",
    symbolLayers: [{
      type: "text",
          
      material: {
        color: [0, 0, 0]
      },
      halo: {
        color: [255, 255, 255, 0.8],
        size: 1
      },
      font: {
        weight: "bold",
        family: "Raleway"
      },
      size: 10,   
    }],
    verticalOffset: {
      screenLength: 60,
      maxWorldLength: 700,
      minWorldLength: 20
    },
    callout: {
      type: "line",
      size: 1,
      color: [0, 0, 0],
      border: {
        color: [255, 255, 255, 0]
      }
    }
  }
}]

const battLabelSmall = [{
  labelPlacement: "above-center",
  labelExpressionInfo: {
    value: "{FT_NAME}"
  },
  minScale: 20000,
  symbol: {
    type: "label-3d",
    symbolLayers: [{
      type: "text",
          
      material: {
        color: [0, 0, 0]
      },
      halo: {
        color: [255, 255, 255, 0.8],
        size: 1
      },
      font: {
        weight: "bold",
        family: "Raleway"
      },
      size: 6,   
    }],
    verticalOffset: {
      screenLength: 30,
      maxWorldLength: 300,
      minWorldLength: 20
    },
    callout: {
      type: "line",
      size: 1,
      color: [0, 0, 0],
      border: {
        color: [255, 255, 255, 0]
      }
    }
  }
}]

const battLabelLarge = [{
  labelPlacement: "above-center",
  labelExpressionInfo: {
    value: "{FT_NAME}"
  },
  minScale: 15000,
  symbol: {
    type: "label-3d",
    symbolLayers: [{
      type: "text",
          
      material: {
        color: [0, 0, 0]
      },
      halo: {
        color: [255, 255, 255, 0.8],
        size: 1
      },
      font: {
        weight: "bold",
        family: "Raleway"
      },
      size: 8,   
    }],
    verticalOffset: {
      screenLength: 30,
      maxWorldLength: 500,
      minWorldLength: 20
    },
    callout: {
      type: "line",
      size: 1,
      color: [0, 0, 0],
      border: {
        color: [255, 255, 255, 0]
      }
    }
  }
}]
