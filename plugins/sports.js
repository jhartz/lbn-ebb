ebb.plugins.push({
    name: "Sports Announcements",
    content: {
        template: '<div class="title">Sports</div>$1',
        variable: "$1"
    },
    options: [{
        name: "Content",
        type: "formattedtextarea",
        variable: "$1",
        value: ""
    }]
});