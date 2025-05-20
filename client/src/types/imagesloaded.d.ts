declare module 'imagesloaded' {
  interface ImagesLoaded {
    on(event: string, callback: (instance?: any) => void): void;
  }

  interface ImagesLoadedStatic {
    (el: Element | NodeList | string, callback?: (instance: ImagesLoaded) => void): ImagesLoaded;
  }

  const imagesLoaded: ImagesLoadedStatic;
  export default imagesLoaded;
}
