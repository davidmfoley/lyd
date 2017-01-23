export type HandlerParams = {
  cwd: string,
  args: Array<string>
}

export type HandlerIO = {
  readFile: (cwd: string) => Promise<string>,

  writeFile: (cwd: string, content: any) => Promise<void>,

  createSymlink: (target: string, path: string) => Promise<void>,
  removeSymlink: (path: string) => Promise<void>,

  readPackageJson: (path: string) => Promise<Map<string, any>>,
  writePackageJson: (path: string, content: Map<string, any>) => Promise<void>
}

export type Handler = (io: HandlerIO) => (params: HandlerParams) => Promise<any>

