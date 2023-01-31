import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { TreeNode } from "primeng/api";
import { first } from 'rxjs/operators';
import { PersonQualification } from "src/app/shared/model/person-qualification.model";
import { Person } from "src/app/shared/model/person.model";
import { Qualification } from "src/app/shared/model/qualification.model";
import { QualificationTree } from "../../model/qualification-tree.model";
import { QualificationService } from "../../service/qualification.service";

@Component({
  selector: 'wbp-qualification',
  templateUrl: './qualification.component.html',
  styleUrls: ['./qualification.component.css']
})

// TODO

// 1 - Pegar as alterações de inclusão / remoção do array vindo do pai ( OK )
// 2 - Permitir a remoção do item pela tabela fora do Dialog ( OK )
// 3 - Marcar o checkbox ( OK )
// 4 - Testar delay no load ( OK )
// 5 - Criar as colunas dinâmicamente (OK - REMOVIDA)
// 7 - Quando o dialog e cancelado depois de add um item ele se perde no controle (OK)
// 8 - Testar

export class QualificationComponent implements OnInit {
  @Input() qualifications: PersonQualification[];
  @Input() disabled: boolean;

  cols: any[];
  qualificationTree: TreeNode[];
  expandedNodes: number[];
  treeCols: any = [];
  selectedNodes: TreeNode[]

  qualification: PersonQualification[] = [];

  search: string;
  personSearch: Person;
  displayModal: boolean = false;
  register: Qualification;
  itemQualiRegister: PersonQualification = new PersonQualification();
  dataTreeControl: number[] = [];
  isLoadingTree: boolean = true;

  constructor( private service: QualificationService ) { }

  ngOnInit() {

    this.cols = this.cols || [
      { field: 'brand', header: 'Qualificações' },
      { field: 'model', header: 'Observação' }
    ];

    this.treeCols = [
      { field: 'name', header: 'Nome', width: '45%' },
    ];

    this.selectedNodes = [];
    this.expandedNodes = [];
    this._getQualificationTree();
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  _getQualificationTree() {
    this.service.tree().pipe(first()).subscribe(data => {
      if (data) {
        let childrens = this._convertDataToTreeNode(Object.assign([], data))

        this.resetTree();
        this.qualificationTree.push(...childrens);
        this.isLoadingTree = false;
      }
    });
  }

  _convertDataToTreeNode(treeDatas: QualificationTree[]): TreeNode[] {
    let nodes: TreeNode[] = [];

    if (treeDatas) {
      for (let childNode of treeDatas) {
        let childrens = null;

        if (childNode.childrens && childNode.childrens.length > 0) {
          childrens = [];
          childrens.push(... this._convertDataToTreeNode(childNode.childrens));
        }

        let node: TreeNode = {
          data: childNode,
          children: childrens,
          leaf: (childNode.parentId != null && childNode.childrens.length == 0),
          expanded: (this.expandedNodes.find(element => element == childNode.id) ? true : false)
        }

        nodes.push(node);
      }
    }
    return nodes;
  }

  /**
   * Busca de forma recursiva um nó na árvore de elementos pelo ID da qualificação
   *
   * @param tree árvore de qualificação
   * @param searchId id a ser procurado
   * @returns se encontra retorna o nó, caso contário null
   */
  _findInTreeById( tree: TreeNode[], searchId: number ) {
    if( tree ) {
      for (let node of tree) {
        if( node.data.id == searchId ) {
          return node;
        } else if( node.children != null ) {
          let foundNode = this._findInTreeById( node.children, searchId );
          if( foundNode ) return foundNode;
        }
      }
    }

    return null;
  }

  resetTree() {
    delete this.qualificationTree;
    this.qualificationTree = [];
  }

  openDialog() {
    this.displayModal = true;

    for( let index in this.qualifications ) {
      let treeNode = this._findInTreeById( this.qualificationTree, this.qualifications[index].qualification.id );
      treeNode.comments = this.qualifications[index].comments;

      // this.qualificationsList.push(... this.qualifications);
      // this.dataTreeControl.push( this.qualifications[index].qualification.id );
      this.addNode( treeNode );
    }
    this.selectedNodes = [];
    this.reloadTree(this.qualificationTree, this.dataTreeControl);
  }

  /**
   * Operações da Tree
   */

  /*
   * Chamado pelo evento de clique da tree
   * @param: Objeto de evento padrão da tree
   */
  nodeSelect( event ) {
    this.addNode( event.node );
    this.selectedNodes = [];
    this.reloadTree( this.qualificationTree, this.dataTreeControl);
  }

  nodeUnselect( event ) {
    this.removeNode( event.node, this.qualifications );
    this.selectedNodes = [];
    this.reloadTree(this.qualificationTree, this.dataTreeControl);
  }

  /*
   * Adicionar o elemento selecionado na tabela e também no controle.
   * Chamada recursiva pelos filhos da tree.
   */
  addNode( node ) {
    if( node ) {
      let duplicated = this.qualifications.findIndex( item => item.qualification.id === node.data.id );

      // Se já houver um item na lista não permitimos que seja adicionado novamente.
      if( duplicated == -1 ) {

        let q = new PersonQualification();
        q.qualification = Object.assign(new QualificationTree, node.data);
        q.comments = node.comments;

        this.qualifications.push( q );

        if (node.leaf) {
          if (!this.dataTreeControl.includes(node.data.id)) {
            this.dataTreeControl.push(node.data.id);
          }
          return;
        }

        for (let i = 0; i < node.children.length; i++) {
          this.addNode(node.children[i]);
        }
      }
    }
  }

  /*
   * Remove um elemento da tabela e também do controle.
   * Chamada recursiva pelo filhos da tree
   */
  removeNode( node: TreeNode, sourceList: PersonQualification[]  ) {
    if( node ) {
      let indexQualification = sourceList.findIndex(item => item.qualification.id == node.data.id);

      if( indexQualification >-1 ) {
        sourceList.splice( indexQualification, 1 );
      }

      if( node.leaf ) {
        this.dataTreeControl.splice( this.dataTreeControl.indexOf( node.data.id ), 1);
        return;
      }
      for(let i=0 ; i < node.children.length ; i++){
          this.removeNode(node.children[i], sourceList);
      }
    } else {
      console.error( "Ocorreu um erro ao remover o nó. " );
    }
  }

  /*
   * Existe um BUG na versão do Prime que a tree
   * não atualiza automaticamente ao remover um item da lista.
   * Por esse motivo temos que fazer todo um reload dela manual.
   * */
  reloadTree( nodes:TreeNode[], idKey:number[] ) {
    nodes.forEach(node => {
      //check parent
      if( idKey.includes( node.data.id ) ) {
        this.selectedNodes.push( node );
      }

      if( node.children != undefined ) {
        node.children.forEach(child => {
          //check child if the parent is not selected
          if(idKey.includes( child.data.id ) && !idKey.includes(node.data.id)) {
            node.partialSelected = true;
            child.parent = node;
          }

          //check the child if the parent is selected
          //push the parent in idKey to new iteration and mark all the childs
          if(idKey.includes(node.data.id)){
            child.parent = node;
            idKey.push(child.data.id);
          }
        });
      }else{
        return;
      }

      this.reloadTree(node.children, idKey);

      node.children.forEach(child => {
        if(child.partialSelected) {
          node.partialSelected = true;
        }
      });
    });
  }

  removeDialogItem( rowItem ) {
    let treeNode = this._findInTreeById( this.qualificationTree, rowItem.qualification.id );

    this.removeNode( treeNode, this.qualifications );
    this.selectedNodes = [];
    this.reloadTree(this.qualificationTree, this.dataTreeControl);
  }

  removeItem( rowItem ) {
    let treeNode = this._findInTreeById( this.qualificationTree, rowItem.qualification.id );

    this.removeNode( treeNode, this.qualifications );
    this.selectedNodes = [];
    this.reloadTree(this.qualificationTree, this.dataTreeControl);
  }


  /*
   * Cancela as ações executadas no DIALOG
   */
  cancel() {
    // for( let index in this.dataTreeControl ) {
    //   let indexQualification = this.qualifications.findIndex(item => item.qualification.id == this.dataTreeControl[index] );
    //   if( indexQualification >= 0 ){
    //     this.dataTreeControl.splice( indexQualification, 1);
    //   }
    // }

    this.qualification = [];
    this.displayModal = false;
  }

  save() {

    for( let item of this.qualification ) {
      this.qualifications.push(item);
    }

    this.qualification = [];
    this.displayModal = false;
  }

  formatQualification(qualification: Object): string {
    return Object.assign(new Qualification(), qualification).getFormatedPath(' > ');
  }

}
