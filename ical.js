const ICalBuilder = (() => {
  function escapeICalText(text) {
    return text.replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n');
  }

  function formatDateISO(datetimeStr) {
    const dt = new Date(datetimeStr);
    return dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  function formatNaiveLocal(datetimeStr) {
    // Remove timezone offset (everything after the seconds)
    const match = datetimeStr.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
    if (!match) return datetimeStr;
  
    const naive = match[1].replace('T', ' ');
    const dateObj = new Date(match[1]); // Use this just to parse the weekday/month
    const time = dateObj.toLocaleString(undefined, {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  
    return `${time} (local time)`;
  }

  function buildFlightEvent({ summary, location, startTime, endTime, description, url }) {
    return `BEGIN:VEVENT
SUMMARY:${escapeICalText(summary)}
DTSTART:${formatDateISO(startTime)}
DTEND:${formatDateISO(endTime)}
LOCATION:${escapeICalText(location)}
DESCRIPTION:${escapeICalText(description)}
URL:${escapeICalText(url || '')}
END:VEVENT`;
  }

  function buildCalendar(events) {
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Flight Tool//EN
${events.join('\n')}
END:VCALENDAR`;
  }

  return {
    buildFlightICS(flightData, opts = {}) {
      const dep = flightData.flightPoints[0];
      const arr = flightData.flightPoints[1];

      const depTime = dep.departure.timings[0].value;
      const arrTime = arr.arrival.timings[0].value;
      const flightNum = `${flightData.flightDesignator.carrierCode}${flightData.flightDesignator.flightNumber}`;
      const operatingCarrier = flightData.segments?.[0]?.partnership?.operatingFlight?.carrierCode;

      const summary = `Flight ${flightNum}: ${dep.iataCode} to ${arr.iataCode}`;
      const location = `${dep.iataCode} to ${arr.iataCode}`;

      const depLocal = formatNaiveLocal(depTime);
      const arrLocal = formatNaiveLocal(arrTime);

      const descParts = [];

      if (opts.confirmation) {
        descParts.push(`Confirmation Number: ${opts.confirmation}`);
      }

      if (opts.notes) {
        descParts.push(`Additional Info:     ${opts.notes}`);
      }
      
      if (opts.notes || opts.confirmation) {
        descParts.push(''); // Add a blank line before flight details
      }

      descParts.push(
        `Flight: ${flightNum}`,
        `From:   ${dep.iataCode} at ${depLocal}`,
        `To:     ${arr.iataCode} at ${arrLocal}`,
        `Operated by:   ${operatingCarrier || 'Unknown Carrier'}`,
        `Aircraft Type: ${flightData.legs?.[0]?.aircraftEquipment?.aircraftType || 'N/A'}`,
        `Duration:      ${flightData.legs?.[0]?.scheduledLegDuration || 'N/A'}`
      );

      const flightAwareUrl = `https://www.flightaware.com/ajax/ignoreall/omnisearch/disambiguation.rvt?searchterm=${flightNum}`;
      // descParts.push(`FlightAware: ${flightAwareUrl}`);

      const description = descParts.join('\n');

      const event = buildFlightEvent({
        summary,
        location,
        startTime: depTime,
        endTime: arrTime,
        description,
        url: flightAwareUrl
      });

      return buildCalendar([event]);
    }
  };
})();
