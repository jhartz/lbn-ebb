ebb.plugins.push({
    name: "Cycle Day",
    type: "html",
    content: 'Cycle <b style="float: right; font-size: 550px; line-height: 100%;">$$%LBNEBB_VAR1</b><br>Day',
    className: "short no-font-adjust",
    options: [{
        name: "Today's Day",
        type: "text",
        variable: "$$%LBNEBB_VAR1",
        value: "1"
    }]
});