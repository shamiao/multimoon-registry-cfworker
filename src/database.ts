interface DbToolchain {
    id: number,
    arch: string,
    name: string,
    last_modified: number,
    // data: number[],
    moonver: string,
    installer: string,
}

interface DbFile {
    id: number,
    type: string,
    toolchain: string,
    arch: string,
    filename: string,
    downloadname: string,
    checksum: string,
}
