import('./bootstrap').then(
    ({ mount }) => {
      const localRoot = document.getElementById('appTrack');
  
      mount({
        mountPoint: localRoot!,
        routingStrategy: 'browser',
      });
    }
  );
  
  export {};
  