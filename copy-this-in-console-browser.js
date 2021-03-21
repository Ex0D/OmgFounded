let apiKey = "your-api-key-here"; // get own here ► https://ipgeolocation.io/

window.oRTCPeerConnection =
  window.oRTCPeerConnection || window.RTCPeerConnection;

window.RTCPeerConnection = function (...args) {
  const pc = new window.oRTCPeerConnection(...args);

  pc.oaddIceCandidate = pc.addIceCandidate;

  pc.addIceCandidate = function (iceCandidate, ...rest) {
    const fields = iceCandidate.candidate.split(" ");

    const ip = fields[4];
    if (fields[7] === "srflx") {
      getLocation(ip);
    }
    return pc.oaddIceCandidate(iceCandidate, ...rest);
  };
  return pc;
};

let getLocation = async (ip) => {
  let url = `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`;

  await fetch(url).then((response) =>
    response.json().then((json) => {
      const output = `
        ---------------------
          IP: ${ip}
          Country: ${json.country_name || "No data"}
          State: ${json.state_prov || "No data"}
          City: ${json.city || "No data"}
          District: ${json.district || "No data"}
          Lat / Long: (${json.latitude}, ${json.longitude})
        ---------------------
        `;
        
      console.clear();
      console.log(output);
    })
  );
};
