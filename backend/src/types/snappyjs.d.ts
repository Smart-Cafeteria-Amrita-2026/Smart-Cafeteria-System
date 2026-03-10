declare module "snappyjs" {
	export function compress(input: ArrayBuffer | Buffer | Uint8Array): ArrayBuffer;
	export function uncompress(input: ArrayBuffer | Buffer | Uint8Array): ArrayBuffer;
}
