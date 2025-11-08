// Bu fayl, TypeScript-ə .png kimi şəkil fayllarını import etməyi öyrədir.
declare module '*.png' {
  const value: any;
  export default value;
}

declare module '*.svg' {
    const value: any;
    export default value;
}
