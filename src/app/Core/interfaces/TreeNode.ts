export interface TreeNode {
    id: string | number;
    name: string;
    type: 'tenant' | 'project' | 'issue' | 'sprint';  // To differentiate items
    expanded: boolean;
    children?: TreeNode[];
}
