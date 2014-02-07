ebb.plugins.push({
    name: "Main Announcements",
    content: {
        template: "$1",
        variable: "$1"
    },
    options: [{
        name: "Content",
        type: "formattedtextarea",
        variable: "$1",
        value: ""
    }]
});