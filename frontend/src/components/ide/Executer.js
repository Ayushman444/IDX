

async function executeCode(language, sourceCode, inputContext) {

  // function getSubmissionData() {
  //   return {
  //       source_code: document.getElementById('codeInput').value,
  //       language_id: document.getElementById('languageSelect').value,
  //       stdin: document.getElementById('userInput').value,
  // };
  let jsonResponse;
  let jsonGetSolution = { status: { id: 0 } }; // Initialize jsonGetSolution
  console.log({
        source_code: sourceCode,
        language_id: language,
        stdin: inputContext
      })


  let response = await fetch('https://judge0-ce.p.rapidapi.com/submissions', {
    method: "POST",
    headers: {
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "x-rapidapi-key": '87427de647mshdad9f8abf321096p1d151ejsnd1d20cc3e49a',
      "content-type": "application/json",
    },
    body: JSON.stringify({
      source_code: sourceCode,
      language_id: language,
      stdin: inputContext
    })
  });

  jsonResponse = await response.json();

  while (jsonGetSolution == null || jsonGetSolution.status.id <= 2) {
    if (jsonResponse.token) {
      let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;

      const getSolution = await fetch(url, {
        method: "GET",
        headers: {
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "x-rapidapi-key": '87427de647mshdad9f8abf321096p1d151ejsnd1d20cc3e49a',
          "content-type": "application/json",
        },
      });

      jsonGetSolution = await getSolution.json();
    }
  }

  // Fetch the submission result after the status is "Accepted"
  let url = `https://judge0-ce.p.rapidapi.com/submissions/${jsonResponse.token}?base64_encoded=true`;

  const getSolution = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "x-rapidapi-key": '87427de647mshdad9f8abf321096p1d151ejsnd1d20cc3e49a',
      "content-type": "application/json",
    },
  });

  jsonGetSolution = await getSolution.json();
  console.log((jsonGetSolution));
  console.log(atob(jsonGetSolution.stdout),"execute");
  return atob(jsonGetSolution.stdout);
}
export {executeCode}