// Bu fayl, TypeScript-ə .png kimi şəkil fayllarını import etməyi öyrədir.
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}
