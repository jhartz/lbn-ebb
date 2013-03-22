ebb.plugins.push({
    name: "Lunch",
    content: {
        "Main Line": "$$%LBNEBB_PLUGIN_VAR1@@#",
        "Express Line": "$$%LBNEBB_PLUGIN_VAR2@@#"
    },
    options: [
        {
            name: "Main Line",
            type: "textarea",
            variable: "$$%LBNEBB_PLUGIN_VAR1@@#"
        },
        {
            name: "Express Line",
            type: "textarea",
            variable: "$$%LBNEBB_PLUGIN_VAR2@@#"
        }
    ]
});