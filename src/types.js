// @flow

export type HandlerParams = {
  cwd: string,
  args: Array<string>
}

export type HandlerIO = {
  log: (...messages: any[]) => void,
  readFile: (cwd: string) => Promise<string>,

  writeFile: (cwd: string, content: any) => Promise<void>,

  symlink: (target: string, path: string) => Promise<void>,
  unlink: (path: string) => Promise<void>,

  readPackageJson: (path: string) => Promise<PackageJsonContent>,
  writePackageJson: (path: string, content: PackageJsonContent) => Promise<void>
}

export type Handler = (io: HandlerIO) => (params: HandlerParams) => Promise<any>

export type PackageJsonContent = {
  linkedDependencies: {[name: string]: string},
  name: string
}

