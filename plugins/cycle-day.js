ebb.plugins.push({
    name: "Cycle Day",
    content: ['Cycle <b style="float: right; font-size: 550px; line-height: 100%;">$1</b><br>Day'],
    className: "short no-font-adjust",
    options: [{
        name: "Today's Day",
        type: "text",
        variable: "$1",
        value: "1"
    }]
});