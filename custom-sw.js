addEventListener('notificationclick', event => {    
    self.clients.matchAll().then(function (clients){
      clients.forEach(function(client){
        client.postMessage({
          action: event.action});
        });
      });
    event.notification.close();
  }, false);