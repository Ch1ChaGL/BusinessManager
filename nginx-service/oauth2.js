function introspectAccessToken(r) {
  r.subrequest("/_oauth2_send_request", function (reply) {
    r.error(JSON.stringify(reply));
    if (reply.status === 200) {
      var responseBody = JSON.parse(reply.responseText);
      r.error(reply.responseText);
      if (responseBody.responseBody.active === true) {
        r.return(204); // Token is valid, return success code
      } else {
        r.return(403); // Token is invalid, return forbidden code
      }
    } else {
      r.return(401); // Unexpected response, return 'auth required'
    }
  });
}

export default { introspectAccessToken };
