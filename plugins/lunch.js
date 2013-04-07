ebb.plugins.push({
    name: "Lunch",
    content: [
        '<div class="title">Main Line</div>$$%LBNEBB_PLUGIN_VAR1@@#',
        '<div class="title">Express Line</div>$$%LBNEBB_PLUGIN_VAR2@@#'
    ],
    options: [
        {
            name: "Main Line",
            type: "filteredtextarea",
            variable: "$$%LBNEBB_PLUGIN_VAR1@@#"
        },
        {
            name: "Express Line",
            type: "filteredtextarea",
            variable: "$$%LBNEBB_PLUGIN_VAR2@@#"
        }
    ]
});