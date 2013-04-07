ebb.plugins.push({
    name: "Main Announcements",
    content: {
        template: "$1",
        variable: "$1"
    },
    options: [{
        name: "Content",
        type: "filteredtextarea",
        variable: "$1",
        value: ""
    }]
});