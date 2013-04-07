ebb.plugins.push({
    name: "BCTC Schedule",
    content: [
        '<div class="title">Students attending BCTC East A.M.</div><ul><li>Arrive at High School by $$%1A</li><li>Bus Departs High School at $$%1B</li><li>Arrive back to High School at $$%1C</li></ul>',
        '<div class="title">Students attending BCTC West A.M.</div><ul><li>Arrive at Middle School by $$%2A</li><li>Bus departs Middle School at $$%2B</li><li>Arrive back to Middle School at $$%2C</li></ul>',
        '<div class="title">Students attending BCTC East P.M.</div><ul><li>Arrive at High School by $$%3A</li><li>Depart High School at $$%3B</li><li>Arrive back to High School at $$%3C</li></ul>'
    ],
    options: [
        {
            name: "East AM - arrive at HS by",
            type: "text",
            variable: "$$%1A",
            value: "7:45 a.m."
        },
        {
            name: "East AM - bus departs HS at",
            type: "text",
            variable: "$$%1B",
            value: "7:50 a.m."
        },
        {
            name: "East AM - arrive back to HS at",
            type: "text",
            variable: "$$%1C",
            value: "10:45 a.m."
        },
        
        {
            name: "West AM - arrive at MS by",
            type: "text",
            variable: "$$%2A",
            value: "7:25 a.m."
        },
        {
            name: "West AM - bus departs MS at",
            type: "text",
            variable: "$$%2B",
            value: "7:30 a.m."
        },
        {
            name: "West AM - arrive back to MS at",
            type: "text",
            variable: "$$%2C",
            value: "10:45 a.m."
        },
        
        {
            name: "East PM - arrive at HS by",
            type: "text",
            variable: "$$%3A",
            value: "10:50 a.m."
        },
        {
            name: "East PM - depart HS at",
            type: "text",
            variable: "$$%3B",
            value: "10:55 a.m."
        },
        {
            name: "East PM - arrive back to HS at",
            type: "text",
            variable: "$$%3C",
            value: "2:30 p.m."
        }
    ]
});