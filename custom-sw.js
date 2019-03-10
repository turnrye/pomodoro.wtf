//eslint-disable-next-line
addEventListener(
  "notificationclick",
  event => {
    //eslint-disable-next-line
    self.clients.matchAll().then(function(clients) {
      clients.forEach(function(client) {
        client.postMessage({
          action: event.action
        });
      });
    });
    event.notification.close();
  },
  false
);
