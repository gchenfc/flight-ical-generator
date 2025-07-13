async function runFlightLookup() {
  const flightCode = document.getElementById('flightCode').value.trim().toUpperCase();
  const match = flightCode.match(/^([A-Z]+)(\d{1,4})$/);
  if (!match) {
    alert("Invalid flight code format. Use format like BF714.");
    return;
  }

  const carrierCode = match[1];
  const flightNumber = match[2];
  const date = document.getElementById('date').value;
  const confirmation = document.getElementById('confirmation').value;
  const notes = document.getElementById('notes').value;
  const output = document.getElementById('output');

  output.textContent = 'Fetching flight info...';

  try {
    const result = await AmadeusAPI.getFlightSchedule({ carrierCode, flightNumber, date });

    if (!result.data || result.data.length === 0) {
      output.textContent = 'No matching flight found.';
      return;
    }

    const flightData = result.data[0];
    const ics = ICalBuilder.buildFlightICS(flightData, { confirmation, notes });

    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${carrierCode}${flightNumber}_${date}.ics`;
    link.textContent = 'Download .ics file';

    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';
    outputDiv.appendChild(link);

    const mailLink = document.createElement('a');
    mailLink.href = `mailto:?subject=Flight ${carrierCode}${flightNumber} Calendar&body=Download your flight .ics file: ${url}`;
    mailLink.textContent = 'Send via Email';
    mailLink.style.marginLeft = '1em';
    outputDiv.appendChild(mailLink);

  } catch (err) {
    output.textContent = 'Error: ' + err.message;
  }
}
