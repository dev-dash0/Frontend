import { Component, Input, signal } from '@angular/core';
import { TreeNode } from '../../Core/interfaces/TreeNode';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css',
  animations: [
    trigger('expandCollapse', [
      state('expanded', style({ height: '*', opacity: 1, transform: 'scaleY(1)' })),
      state('collapsed', style({ height: '0px', opacity: 0, transform: 'scaleY(0.8)' })),
      transition('expanded <=> collapsed', animate('300ms ease-in-out'))
    ])
  ]
})

export class TreeComponent {
  @Input() nodes: TreeNode[] = [];


  toggle(node: TreeNode) {
    if (node.children?.length) {
      node.expanded = !node.expanded;

    }
  }
  // Function to check if the node is a root or parent
  isRootOrParent(node: TreeNode): boolean {
    return node.expanded ?? false; // ✅ This ensures it's always a boolean
  }

}
