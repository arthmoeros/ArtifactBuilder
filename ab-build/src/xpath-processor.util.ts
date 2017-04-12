import xpath = require("xpath");
import dom = require("xmldom");
import fs = require("fs");

export const ELEMENT_NODE: number = 1;
export class XpathProcessorUtil {

	private rootNode: Node;

	public get $rootNode(): Node {
		return this.rootNode;
	}

	constructor(xmlContent: string) {
		let xmlDocument: Node = new dom.DOMParser().parseFromString(xmlContent);
		this.rootNode = <Node>xpath.select("/*", xmlDocument)[0];
	}

	public isPresent(query: string, node?: Node): boolean {
		if (!node) {
			node = this.rootNode;
		}
		let foundNodes: Node[] = <Node[]>xpath.select(query, node);
		return foundNodes.length > 0;
	}

	public selectNodes(query: string, node?: Node): Node[] {
		if (!node) {
			node = this.rootNode;
		}
		let foundNodes: Node[] = <Node[]>xpath.select(query, node);
		if (!foundNodes) {
			let xmlNode = new dom.XMLSerializer().serializeToString(node);
			throw new Error("XPath expression '" + query + "' didn't get any results using the following XML \n" + xmlNode);
		} else {
			return foundNodes;
		}
	}

	public selectValue(query: string, node?: Node): string {
		if (!node) {
			node = this.rootNode;
		}
		let foundNodes = this.selectNodes(query, node);
		if (!foundNodes[0]) {
			return "";
		} else {
			return foundNodes[0].textContent;
		}
	}

}