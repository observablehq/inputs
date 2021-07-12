import * as Inputs from "@observablehq/inputs";
import tape from "./jsdom.js";

tape("Inputs.text() test  initial value is set to ''", test => {
    const t = Inputs.text();
    test.equal(t.value, "");
  });

tape("Inputs.text() test setting various text properties ", test => {
    const t = Inputs.text({type: "password", label: "Name", placeholder: "Enter your name", value: "Anonymous"});
    test.equal(t.value, "Anonymous");
    test.equal(t.textContent.trim(), "Name");
    test.equal(t.elements.text.placeholder, "Enter your name");
    test.equal(t.elements.text.type, "password");
  });

  tape("Inputs.text() test type=date settings ", test => {
    const t = Inputs.text({type: "date", label: "Date",  value: "1970-01-01"});
    test.equal(t.value, "1970-01-01");
    test.equal(t.textContent.trim(), "Date");
    test.equal(t.elements.text.type, "date");
  });

  tape("Inputs.text() test type=date setting initial value ", test => {
    const t = Inputs.text({type: "date", label: "Date",  value: "1970-01-01", min: "1970-01-01", max: "2021-07-11"});
    test.equal(t.value, "1970-01-01");
    test.equal(t.textContent.trim(), "Date");
    test.equal(t.elements.text.type, "date");
    test.equal(t.elements.text.min, "1970-01-01");
    test.equal(t.elements.text.max, "2021-07-11");
  });

  tape("Inputs.text() test type=date settings for min and max", test => {
    const t = Inputs.text({type: "date", label: "Date",  value: "2010-01-01", min: "2000-01-01", max: "2021-07-11"});
    test.equal(t.value, "2010-01-01");
    t.value = "2015-01-01";
    test.equal(t.value, "2015-01-01");
    t.value = "1999-01-01";
    // We should not be able to the date to a value outside of the [min, max] range
    test.notEqual(t.value, "1999-01-01");
    // verify that trying to set an invalid date does not change the existing value
    test.equal(t.value, "2015-01-01");
  });


