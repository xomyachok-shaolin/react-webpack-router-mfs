import('./bootstrap').then(
    ({ mount }) => {
      const localRoot = document.getElementById('appAuthorization');
  
      mount({
        mountPoint: localRoot!,
        routingStrategy: 'browser',
      });
    }
  );
  
  export {};
  