import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService, TreeNode } from 'primeng/api';
import { first } from 'rxjs/operators';
import { PersonQualification } from 'src/app/shared/model/person-qualification.model';
import { QualificationTree } from 'src/app/shared/model/qualification-tree.model';
import { Qualification } from 'src/app/shared/model/qualification.model';
import { QualificationService } from 'src/app/shared/service/qualification.service';

@Component({
    selector: 'app-qualification-register-form',
    templateUrl: './qualification-register-form.component.html',
    styleUrls: ['./qualification-register-form.component.css']
})
export class QualificationRegisterFormComponent implements OnInit {
    $qualificationTreePromise: Promise<TreeNode[]>;

    qualificationTree: TreeNode[];

    nodeParentSelected: TreeNode;
    qualificationParentSelected: QualificationTree;
    newQualificationNode: QualificationTree;

    expandedNodes: number[];

    treeCols: any = []

    displayNodeFormDialog: boolean;
    editMode = false;

    @ViewChild('nodeDialogForm', { static: false }) nodeDialogForm: NgForm;

    constructor(private messageService: MessageService,
                private confirmationService: ConfirmationService,
                private service: QualificationService) { }

    ngOnInit(): void {
        this.treeCols = [
            { field: 'name', header: 'Nome', width: '45%' },
            { field: 'childrens', header: 'Qtd. Dependentes', width: '13%' },
            { field: 'required', header: 'Requerido', width: '13%' },
            { field: 'active', header: 'Ativo', width: '13%' },
            { field: 'actions', header: '', width: '15%' }
        ];

        this.expandedNodes = [];

        this.resetForm();
        this.resetTree();

        this._getQualificationTree();
    }

    resetForm() {
        this.displayNodeFormDialog = false;
        this.nodeParentSelected = {};
        this.qualificationParentSelected = new QualificationTree();
        this.newQualificationNode = new QualificationTree();
        this.newQualificationNode.active = true;
        this.newQualificationNode.required = false;
        this.editMode = false;
    }

    resetTree() {
        delete this.qualificationTree;
        this.qualificationTree = [];
        this.$qualificationTreePromise = Promise.resolve(this.qualificationTree);
    }

    _getQualificationTree() {
        this.service.tree().pipe(first()).subscribe(data => {
            if (data) {
                let childrens = this._convertDataToTreeNode(Object.assign([], data))

                this.resetTree();
                this.qualificationTree.push(...childrens);

                this.$qualificationTreePromise = Promise.resolve(this.qualificationTree);
            }
        });
    }

    _convertDataToTreeNode(treeDatas: QualificationTree[]): TreeNode[] {
        let nodes: TreeNode[] = [];

        if (treeDatas) {
            for (let childNode of treeDatas) {
                let childrens = [];

                if (childNode.childrens && childNode.childrens.length > 0) {
                    childrens.push(... this._convertDataToTreeNode(childNode.childrens));
                }

                let node: TreeNode = {
                    data: childNode,
                    children: childrens,
                    leaf: (childNode.parentId != null && childrens.length == 0),
                    expanded: (this.expandedNodes.find(element => element == childNode.id) ? true : false)
                }

                nodes.push(node);
            }
        }
        return nodes;
    }

    /**
     * Utils
     */
    randomId() {
        return (Math.random() + new Date().getUTCMilliseconds()) * -1;
    }

    /*
     * Tree Actions
     */
    saveAndEdit() {
        if( this.editMode ) {
            this.newQualificationNode.parentId = this.qualificationParentSelected.id;
            this.newQualificationNode.seq = this.qualificationParentSelected.seq;
            
            this._update( this.newQualificationNode );

        } else {
            this.newQualificationNode.parentId = this.qualificationParentSelected.id;
            
            if( !this.qualificationParentSelected.id ) {
                this.newQualificationNode.seq = this.qualificationTree.length + 1;
            } else {
                this.newQualificationNode.seq = this.nodeParentSelected.children.length + 1;
            }
            
            this._save( this.newQualificationNode );
        }
    }

    removeChild(selectedNode: any) {
        if (selectedNode) {
            let node = Object.assign(new QualificationTree, selectedNode.node.data);

            if (node && node.childrens?.length > 0) {
                this.confirmationService.confirm({
                    message: "Existem elementos abaixo da qualificação <strong>" + node.name + "</strong>, todos eles serão excluídos, deseja continuar ?",
                    header: 'Exclusão da qualificação',
                    acceptLabel: 'Confirmar',
                    rejectLabel: 'Cancelar',
                    accept: () => {
                        this._deleteChild(node);
                    }
                });

            } else {
                this.confirmationService.confirm({
                    message: `Deseja remover a qualificação <strong>` + node.name + `</strong> ?`,
                    header: 'Exclusão da qualificação',
                    acceptLabel: 'Confirmar',
                    rejectLabel: 'Cancelar',

                    accept: () => {
                        this._deleteChild(node);
                    }
                });
            }
        }
    }

    _deleteChild(qualification: Qualification) {
        this.service.delete(qualification.id).pipe(first()).subscribe(data => {
            this.messageService.add({
                key: 'tst',
                severity: 'info',
                summary: 'Removido com Sucesso!',
                detail: 'Registro removido com sucesso!'
            });

            this.resetForm();
            this._getQualificationTree();
        }, error => {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
    }

    _save( node: Qualification, showMessage: boolean = true ) {

        this.service.save( node ).pipe(first()).subscribe(data => {
            
            if( showMessage ) {
                this.messageService.add({
                    key: 'tst',
                    severity: 'success',
                    summary: 'Salvo com sucesso',
                    detail: `Registro adicionado com sucesso!`
                });
            }

            this._getQualificationTree();
            this.closeNodeDialog();
            this.resetForm();
            
        }, error => {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
    }

    _update( node: Qualification, showMessage: boolean = true ) {

        this.service.update( node ).pipe(first()).subscribe(data => {
            
            if( showMessage ) {
                this.messageService.add({
                    key: 'tst',
                    severity: 'success',
                    summary: 'Salvo com sucesso',
                    detail: `Registro atualizado com sucesso!`
                });
            }

            this._getQualificationTree();
            this.closeNodeDialog();
            this.resetForm();
            
        }, error => {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
        });
    }

    move( qualification: any, direction: string ) {
        let tree = null;

        if( !direction && ( direction != "UP" && direction != "DOWN" )  ) {
            console.error( "Erro ao ordenar a tree, direção errada." );
            return;
        }

        if( qualification != null && qualification.parent ) {
            tree = qualification.parent.children;
        } else {
            tree = this.qualificationTree;
        }
        
        for( let index = 0; index < tree.length; index++ ) {
            let node = Object.assign(new QualificationTree, tree[ index ].data );

            if( node.id === qualification.node.data.id ) {
                let lastIndex = -1;

                if( direction == "UP" ) {
                    lastIndex = index - 1;
                    
                    if( lastIndex < 0 ) {
                        return;
                    }
                
                } else if( direction == "DOWN" ) {
                    lastIndex = index + 1;

                    if( lastIndex >= tree.length ) {
                        return;
                    }
                }

                let previousNode = Object.assign(new QualificationTree, tree[ lastIndex ].data );

                if( direction == "UP" ) {
                    node.seq -= 1;
                    previousNode.seq += 1;

                } else if( direction == "DOWN" ) {
                    node.seq += 1;
                    previousNode.seq -= 1;
                }

                // FIXME está chamando 2x o load da tela ( getTree )
                this._update( node, false );
                this._update( previousNode, false );

                continue;
            }
        }

    }

    /*
     * Tree Events
     */
    onNodeExpand(event) {
        if (event && event.node) {
            this._expandNode( event.node );
        }
    }

    onNodeCollapse(event) {
        if (event && event.node) {
            this._collapseNode( event.node );
        }
    }

    collapseAll() {
        if( this.qualificationTree ) {
            this.collapseTree( this.qualificationTree );
            this.$qualificationTreePromise = Promise.resolve(this.qualificationTree);
        }
    }

    collapseTree( tree: TreeNode[] ) {
        if( tree ) {
            for (let childNode of tree) {
                this._collapseNode( childNode );

                if( childNode.children && childNode.children.length > 0 ) {
                    this.collapseTree( childNode.children );
                }
            }
        }
    }

    _collapseNode( node: TreeNode ) {
        if( node ) {
            node.expanded = false;
            this.expandedNodes = this.expandedNodes.filter(id => id !== node.data.id);
        }
    }

    expandAll() {
        if( this.qualificationTree ) {
            this.expandTree( this.qualificationTree );
            this.$qualificationTreePromise = Promise.resolve(this.qualificationTree);
        }
    }

    expandTree( tree: TreeNode[] ) {
        if( tree ) {
            for (let childNode of tree) {
                this._expandNode( childNode );

                if( childNode.children && childNode.children.length > 0 ) {
                    this.expandTree( childNode.children );
                }
            }
        }
    }

    _expandNode( node: TreeNode ) {
        if( node ) {
            node.expanded = true;
            this.expandedNodes.push(node.data.id);
        }
    }

    /*
     * Dialog Actions
     */
    newNodeDialog(parentNode: any) {
        this.editMode = false;

        if (parentNode) {
            this.qualificationParentSelected = Object.assign(new QualificationTree, parentNode.node.data)
            this.nodeParentSelected = Object.assign(new Object(), parentNode.node)
        } else {
            this.nodeParentSelected.children = [];
        }

        this.displayNodeFormDialog = true;
    }

    editNodeDialog(parentNode: any) {
        this.editMode = true;

        if (parentNode) {
            this.qualificationParentSelected = Object.assign(new QualificationTree, parentNode.node.data)
            this.newQualificationNode = Object.assign(new QualificationTree, parentNode.node.data);
        }

        this.displayNodeFormDialog = true;
    }

    closeNodeDialog() {
        this.displayNodeFormDialog = false;
        this.nodeDialogForm.form.reset();
    }
}
