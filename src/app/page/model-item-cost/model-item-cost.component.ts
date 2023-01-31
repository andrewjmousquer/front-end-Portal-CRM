import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Brand } from 'src/app/shared/model/brand.model';
import { ModelItemCost } from 'src/app/shared/model/model-item-cost.model';
import { Model } from 'src/app/shared/model/model.model';
import { ModelItemCostService } from 'src/app/shared/service/model-item-cost.service';
import { BrandFormService } from '../brand-form/brand-form.service';
import { ModelFormService } from '../model-form/model-form.service';
import { first } from 'rxjs/operators';
import { Item } from 'src/app/shared/model/item.model';
import { ItemFormService } from '../item-form/item-form.service';
import { ItemModel } from 'src/app/shared/model/item-model.model';
import { Utils } from 'src/app/shared/util/util';
import { ItemModelService } from 'src/app/shared/service/item-model.service';
import { ModelItemCostAdjustement } from './dto/model-item-cost-adjustement.model';

@Component({
  selector: 'portal-model-item-cost',
  templateUrl: './model-item-cost.component.html',
  styleUrls: ['./model-item-cost.component.css']
})
export class ModelItemCostComponent implements OnInit {

  /***************************************************************************************/
  /******************************* Variáveis globais *************************************/
  /***************************************************************************************/
  
  /* Indica que uma edição está sendo feita quando uma linha do DataTable é selecionada */
  isEdit = false;
  /* Configurações das colunas do DataTable */
  dataTableColumns: any[];
  /* Lista com todos os Custos por Modelo e Item cadastrados para exibir no DataTable */
  modelItemCostList: ModelItemCost[];
  /* Listas de Itens, Modelos e Faixas de Ano/Modelo */
  itemListGlobal: Item[];
  modelListGlobal: Model[];
  modelYearRangeList: ItemModel[];

  /***************************************************************************************/
  /*********************** Variáveis para formulario de pesquisa *************************/
  /***************************************************************************************/
  
  /* Listas com os dados dos DropDowns do formulário de pesquisa */
  itemModelListSearch: ItemModel[];
  brandListSearch: Brand[];
  modelListSearch: Model[];

  /* Objetos dos DropDowns para pesquisa */
  itemSearch: Item;
  brandSearch: Brand;
  modelSearch: Model;
  /* Data do formulário de pesquisa */
  dateSearch: Date;

  /***************************************************************************************/
  /*********************** Variáveis para formulário de cadastro *************************/
  /***************************************************************************************/

  /* Listas com os dados dos DropDowns do formulário de cadastro */
  itemModelListRegister: ItemModel[];
  brandListRegister: Brand[];
  modelListRegister: Model[];
  
  /* Objetos dos DropDowns para cadastro */
  itemRegister: Item;
  brandRegister: Brand;
  modelRegister: Model;
  modelYearRangeRegister: ItemModel;
  /* Objeto principal que representa um Custo por Modelo e Item no cadastro */
  modelItemCostRegister: ModelItemCost;

  /***************************************************************************************/
  /********************* Variáveis para os formulários das Dialogs ***********************/
  /***************************************************************************************/

  /* Lista com todos os Custos por Modelo e Item selecionados no DataTable */
  modelItemCostEditList: ModelItemCost[];
  modelItemCostErrorList: ModelItemCost[];
  /* Variáveis para edição usadas nas modais a partir dos itens selecionados no DataTable */
  modelItemCostAdjustementDialog: ModelItemCostAdjustement;
  /* Flags para exibir os Dialogs */
  showAdjustementPriceDialog: boolean;
  showAdjustementPeriodDialog: boolean;
  showDuplicationDialog: boolean;

  /* Flag para exibir a aba com o resultado da validação dentro do Dialog*/
  showValidateTab: boolean;

  @ViewChild('modelItemCostRegisterForm', { static: false }) modelItemCostRegisterForm: NgForm;
  @ViewChild('adjustementPriceDialogForm', { static: false }) adjustementPriceDialogForm: NgForm;
  @ViewChild('duplicationDialogForm', { static: false }) duplicationDialogForm: NgForm;
  @ViewChild('adjustementPeriodDialogForm', { static: false }) adjustementPeriodDialogForm: NgForm;

  @ViewChild('dt', { static: false }) dt: any;

  constructor(private brandService: BrandFormService,
              private itemService: ItemFormService,
              private modelService: ModelFormService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private modelItemCostService: ModelItemCostService,
              private itemModelService: ItemModelService
  ) { }

  ngOnInit() {

    /* Headers das colunas do DataTable */
    this.dataTableColumns = [
      { header: 'Marca', field: 'brand.name' },
      { header: 'Modelo', field: 'itemModel.model.name' },
      { header: 'Item', field: 'item.name' },
      { header: 'Faixa Ano Modelo', field: 'itemModel.modelYearStart' },
      { header: 'Período', field: 'startDate' },
      { header: 'Total', field: 'price' },
    ];

    /* Inicializa a tela por completo (Pesquisa, Cadastro e DataTable) */
    this.initDialogs(true);
    this.loadItemListGlobal();
    this.loadItemModelListGlobal();
    this.initSearchForm(true);
    this.initRegisterForm();

  }

  /* Inicializa as Dialogs */
  initDialogs(closeAll: boolean) {
    this.showValidateTab = false;
    if (closeAll) {
      this.showAdjustementPriceDialog = false;
      this.showAdjustementPeriodDialog = false;
      this.showDuplicationDialog = false;
      this.adjustementPriceDialogForm?.form.reset();
      this.duplicationDialogForm?.form.reset();
      this.adjustementPeriodDialogForm?.form.reset();
    }
    this.modelItemCostAdjustementDialog = new ModelItemCostAdjustement();
  }

  /* Carrega a lista de Itens pra os DropDowns da pesquisa e cadastro */
  loadItemListGlobal() {
    this.itemService.search(new Item).pipe(first()).subscribe(data => {
      this.itemListGlobal = data ? data : [];
    });
  }

  /* Carrega uma lista com todos os Modelos para ser utilizada de filtro nos DropDowns de Marca */
  loadItemModelListGlobal() {
    this.modelService.getAll().pipe(first()).subscribe(data => {
      this.modelListGlobal = data.filter(model => model.active);
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  /** Inicializa/Reseta o formulário de pesquisa por completo
   ** Reseta os Objetos dos DropDowns e recarrega o DataTable 
   * @loadDataTable: flag que indica se o DataTable deve ser recarregado */
  initSearchForm(loadDataTable: boolean) {
    if (loadDataTable) {
      this.modelItemCostEditList = new Array<ModelItemCost>();
      this.modelItemCostErrorList = new Array<ModelItemCost>();
      this.loadModelItemCostDataTable();
    }
    this.itemSearch = null;
    this.dateSearch = null;
    this.initBrandSearch(null);
  }

  /** Inicializa/Reseta o DropDown da Marca 
   ** Obrigatoriamente, sempre irá resetar o DropDpwn do Modelo também
   ** @item: item que foi selecionado no DropDown para filtrar as Marcas relacionadas */
  initBrandSearch(item: Item) {
    this.brandSearch = null;
    /* Se o Item selecionado for Genérico, desabilita os DropDowns de Marca e Modelo, limpando suas listas */
    if (item?.generic) {
      this.brandListSearch = new Array<Brand>();
    } else {
      this.loadBrandListSearch(item);
    }
    this.initModelSearch(item ? true : false, null);
  }

  /** Inicializa/Reseta o DropDown do modelo
   ** @cleanList: flag que indica que a lista deve ser limpa. 
   ** @brand: marca que foi selecionada no DropDown para filtrar os Modelos relacionados */
  initModelSearch(cleanList: boolean, brand: Brand) {
    this.modelSearch = null;
    /* Se a flag for true, apenas limpa a lista */
    if (cleanList) {
      this.modelListSearch = new Array<Model>();
    } else {
      /* Se a flag for false, então filtra pela Marca informada */
      this.loadModelListSearch(brand);
    }
  }

  /* Carrega o DataTable com todos os Custos por Modelo e Item existentes */
  loadModelItemCostDataTable() {
    this.modelItemCostList = new Array<ModelItemCost>();
    this.modelItemCostService.getAll().pipe(first()).subscribe(data => {
      this.modelItemCostList  = data.map(modelItemCost => {
        return {
          ...modelItemCost,
          /* Ajusta o formato da data retornada pelo backend */
          startDate: new Date(modelItemCost.startDate),
          endDate: new Date(modelItemCost.endDate)
        }
      });
    }, error => {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    })
  }

  /* Carrega a lista de Marcas pra o DropDown da pesquisa
  ** @item: item que foi selecionado no DropDown para filtrar as Marcas relacionadas */
  loadBrandListSearch(item: Item) {
    this.brandListSearch = new Array<Brand>();
    /* Se o item não foi informado, busca a lista completa de Marcas ativas
     * Essa opção de lista completa só existe para o formulário de pesquisa */
    if (!item) {
      let brandFilter: Brand = new Brand;
      brandFilter.active = true;
      this.brandService.search(brandFilter).pipe(first()).subscribe(data => {
        this.brandListSearch = data ? data : [];
      });
    } else {
      /* Se o Item foi informado, busca a lista de Marcas filtrando pelos Modelos que possuem
      ** vínculo com o Item informado */
      for (let index in this.itemModelListSearch) {
        let model = this.modelListGlobal.find(model => model.id == this.itemModelListSearch[index].model.id);
        if (model) {
          if (this.brandListSearch.findIndex(i => i.id == model.brand.id) == -1) {
            this.brandListSearch.push(model.brand);
          }
        }
      }
    }
  }

  /** Carrega a lista de Modelos pra o DropDown da pesquisa
   ** @brand: marca que foi selecionada no DropDown para filtrar os Modelos relacionados */
  loadModelListSearch(brand: Brand) {
    /* Se a Marca não for informada, busca a lista completa de Modelos
     * Essa opção de lista completa só existe para o formulário de pesquisa */
    if (!brand) {
      this.modelListSearch = this.modelListGlobal;
    } else {
      /* Se a Marca for informada, busca a lista de Modelos que possuem vínculo com a Marca informada */
      this.modelService.getAllByBrand(brand.id).pipe(first()).subscribe(data => {
        this.modelListSearch = data;
      })
    }
  }

  /** Executado quando o DropDown de Item na pesquisa tiver seu valor alterado 
   ** Se o evento não possuir valor, significa que o valor do DropDown foi removido e é necessário resetar o DropDown de Marcas
   ** Se o evento possuir valor, significa que um Item foi selecionado e é necessário atualizar o DropDown de Marcas */
  itemSearchChanged(event:any) {
    if (event?.value == null) {
      this.initBrandSearch(null);
    } else {
      this.loadItemModelListSearchByItem(event.value);
    }
  }

  /** Executado quando o DropDown de Marca na pesquisa tiver seu valor alterado 
   ** Se o evento não possuir valor, significa que o valor do DropDown foi removido e é necessário resetar o DropDown de Modelos
   ** Se o evento possuir valor, significa que uma Marca foi selecionada e é necessário atualizar o DropDown de Modelos */
  brandSearchChanged(event:any) {
    if (event?.value == null) {
      this.initModelSearch(this.itemSearch ? true : false, null);
    } else {
      this.initModelSearch(false, event.value);
    }
  }

  loadItemModelListSearchByItem(item: Item) {
    let itemModelFilter = new ItemModel();
    itemModelFilter.item = new Item();
    itemModelFilter.item.id = item.id;
    this.itemModelService.search(itemModelFilter)
      .pipe(first())
      .subscribe(data => {
        this.itemModelListSearch = data;
        this.initBrandSearch(item);
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
  }

  /** Inicializa/Reseta o formulário de cadastro por completo
   ** Reseta todos os e flags Objetos */
  initRegisterForm() {
    this.isEdit = false;
    this.itemRegister = null;
    this.modelItemCostRegister = new ModelItemCost();
    this.initBrandRegister(null);
    this.modelItemCostRegisterForm?.form?.reset();
  }

  /** Inicializa/Reseta o DropDown da Marca 
   ** Obrigatoriamente, sempre irá resetar o DropDpwn do Modelo também
   ** @item: item que foi selecionado no DropDown para filtrar as Marcas relacionadas */
   initBrandRegister(item: Item) {
    /* Só limpa a variável se não for edição */
    if (!this.isEdit) {
      this.brandRegister = null;
    }
    /* Se o Item selecionado for Genérico, desabilita os DropDowns de Marca, Modelo e Faixa Ano/Modelo */
    if (item?.generic) {
      this.brandListRegister = new Array<Brand>();
    } else {
      this.loadBrandListRegister(item);
    }
    /* Se for edição deve carregar a lista de Modelos adequadamente */
    if (this.isEdit) {
      this.initModelRegister(false, this.brandRegister);
    } else {
      this.initModelRegister(item ? true : false, null);
    }
  }

  /** Inicializa/Reseta o DropDown do Modelo
   ** @cleanList: flag que indica que a lista deve ser limpa. 
   ** @brand: marca que foi selecionada no DropDown para filtrar os Modelos relacionados */
  initModelRegister(cleanList: boolean, brand: Brand) {
    /* Só limpa a variável se não for edição */
    if (!this.isEdit) {
      this.modelRegister = null;
    }
    /* Se a flag for true, apenas limpa a lista */
    if (cleanList) {
      this.modelListRegister = new Array<Model>();
    } else {
      /* Se a flag for false, então filtra pela Marca informada */
      this.loadModelListRegister(brand);
    }
    this.initModelYearRangeRegister(this.isEdit ? this.modelRegister : null);
  }

  initModelYearRangeRegister(model: Model) {
    /* Só limpa a variável se não for edição */
    if (!this.isEdit) {
      this.modelYearRangeRegister = null;
    }
    this.loadModelYearRangeRegister(model);
    this.isEdit = false;
  }

  /* Carrega a lista de Marcas pra o DropDown do cadastro
  ** @item: item que foi selecionado no DropDown para filtrar as Marcas relacionadas */
  loadBrandListRegister(item: Item) {
    this.brandListRegister = new Array<Brand>();
    /* Se o Item foi informado, busca a lista de Marcas filtrando pelos Modelos que possuem
    ** vínculo com o Item informado */
    if (item) {
      for (let index in this.itemModelListRegister) {
        let model = this.modelListGlobal.find(model => model.id == this.itemModelListRegister[index].model.id);
        if (model) {
          if (this.brandListRegister.findIndex(i => i.id == model.brand.id) == -1) {
            this.brandListRegister.push(model.brand);
          }
        }
      }
    }
  }

  /** Carrega a lista de Modelos pra o DropDown do cadastro
   ** @brand: marca que foi selecionada no DropDown para filtrar os Modelos relacionados */
  loadModelListRegister(brand: Brand) {
    this.modelListRegister = new Array<Model>();
    /* Se a Marca for informada, busca a lista de Modelos que possuem vínculo com a Marca informada */
    if (brand) {
      for (let index in this.itemModelListRegister) {
        let model = this.modelListGlobal.find(model => model.id == this.itemModelListRegister[index].model.id
          && brand.id == model.brand.id);
        if (model) {
          if (this.modelListRegister.findIndex(i => i.id == model.brand.id) == -1) {
            this.modelListRegister.push(model);
          }
        }
      }
    }
  }

  loadModelYearRangeRegister(model: Model) {
    /* Se o Modelo não for informado, limpa a lista */
    if (!model) {
      this.modelYearRangeList = new Array<ItemModel>();
    } else {
      /* Se o Modelo for informado, busca a lista dos vínculos de Item e Modelo referentes ao Modelo e Item selecionados */
      this.modelYearRangeList = this.itemModelListRegister
                    .filter(itemModel => itemModel.item.id == this.itemRegister?.id && itemModel.model.id == model?.id);
    }
  }

  /** Executado quando o DropDown de Item no cadastro tiver seu valor alterado 
   ** Se o evento não possuir valor, significa que o valor do DropDown foi removido e é necessário resetar o DropDown de Marcas
   ** Se o evento possuir valor, significa que um Item foi selecionado e é necessário atualizar o DropDown de Marcas */
  itemRegisterChanged(event:any) {
    if (event?.value == null) {
      this.initBrandRegister(null);
    } else {
      this.loadItemModelListRegisterByItem(event.value);
    }
  }

  /** Executado quando o DropDown de Marca no cadastro tiver seu valor alterado 
   ** Se o evento não possuir valor, significa que o valor do DropDown foi removido e é necessário resetar o DropDown de Modelos
   ** Se o evento possuir valor, significa que uma Marca foi selecionada e é necessário atualizar o DropDown de Modelos */
  brandRegisterChanged(event:any) {
    if (event?.value == null) {
      this.initModelRegister(this.itemRegister ? true : false, null);
    } else {
      this.initModelRegister(false, event.value);
    }
  }

  /** Executado quando o DropDown de Modelo no cadastro tiver seu valor alterado 
   ** Se o evento não possuir valor, significa que o valor do DropDown foi removido e é necessário resetar o DropDown Faixa Ano/Modelo
   ** Se o evento possuir valor, significa que um Modelo foi selecionado e é necessário atualizar o DropDown de Faixa Ano/Modelo */
  modelRegisterChanged(event:any) {
    if (event?.value == null) {
      this.initModelYearRangeRegister(null);
    } else {
      this.initModelYearRangeRegister(event.value);
    }
  }

  /** Executado quando o Switch de Todas as Marcas no cadastro tiver seu valor alterado 
   ** @allBrandsSelected: se for true, deve limpar os DropDowns de Marca, Modelo e Faixa Ano/Modelo 
   **                     se for false, recarrega os DropDowns de Marca, Modelo e Faixa Ano/Modelo */
  allBrandsOptionChanged(allBrandsSelected: Boolean) {
    if (allBrandsSelected) {
      this.initBrandRegister(null);
    } else {
      this.initBrandRegister(this.itemRegister);
    }
  }

  /** Executado quando o Switch de Todos os Modelos no cadastro tiver seu valor alterado 
   ** @allModelsSelected: se for true, deve limpar os DropDowns Modelo e Faixa Ano/Modelo 
   **                     se for false, recarrega os DropDowns Modelo e Faixa Ano/Modelo */
  allModelsOptionChanged(allModelsSelected: Boolean) {
    if (allModelsSelected) {
      this.initModelRegister(true, null);
    } else {
      this.initModelRegister(false, this.brandRegister);
    }
  }

  /** Quando um item é selecionado no DropDown de cadastro, é necessário carregar os vínculos de ItemModel
   ** antes de carregar o DropDown das Marcas
   ** @item: item selecionado no DropDown para filtrar apenas Modelos e Marcas que possuem vínculo com ele */
  loadItemModelListRegisterByItem(item: Item) {
    let itemModelFilter = new ItemModel();
    itemModelFilter.item = new Item();
    itemModelFilter.item.id = item.id;
    this.itemModelService.search(itemModelFilter)
      .pipe(first())
      .subscribe(data => {
        this.itemModelListRegister = data;
        this.initBrandRegister(item);
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
  }

  /** Validação para não permitir informar um Período Final menor do que o Período Inicial */
  validateEndDate() {
    if (this.modelItemCostRegister?.endDate?.getDate() < this.modelItemCostRegister.startDate.getDate()) {
      this.modelItemCostRegister.endDate = new Date(this.modelItemCostRegister.startDate);
    }
  }

  /** Validação para não permitir informar um Período Final menor do que o Período Inicial no Dialog */
  validateEndDateDialog() {
    if (this.modelItemCostAdjustementDialog?.endDate?.getDate() < this.modelItemCostAdjustementDialog.startDate.getDate()) {
      this.modelItemCostAdjustementDialog.endDate = new Date(this.modelItemCostAdjustementDialog.startDate);
    }
  }

  /** Formata uma Data Início e uma Data Fim para apresentar um período no DataTable */
  formatModelYear(start, end) {
    return Utils.formatModelYear(start, end);
  }

  /** Validação dos Dialogs de Edição para quando quando alternar entre os tipos de Ajuste: Monetário e Percentagem 
   ** Apenas reseta os valores selecionados para Porcentagem ou Monetário de acordo com o tipo selecionado  */
  adjustementChanged() {
    if (this.modelItemCostAdjustementDialog.adjustement == "monetary") {
      this.modelItemCostAdjustementDialog.percentValue = null;
    } else {
      this.modelItemCostAdjustementDialog.monetaryValue = null;
    }
  }

  /** Validação dos Dialogs de Edição para quando quando alternar entre os tipos de Ação: Ajustar e Redefinir
   ** Se o tipo selecionado for Redefinir, então obrigatoriamente apenas o tipo de Ajuste: Monetário ficará disponível */
  actionChanged() {
    if (this.modelItemCostAdjustementDialog.action == "reset") {
      this.modelItemCostAdjustementDialog.adjustement = "monetary";
    }
  }

  /** Abre o Dialog de Edição de Valores
   ** Se apenas um item estiver selecionado no DataTable, preenche o Objeto modelItemCost
   ** Se mais de um item estiver selecionado no DataTable, preenche a Lista modelItemCostList */
  openAdjustementPriceDialog() {
    this.showAdjustementPriceDialog = true;
  }

  /** Abre o Dialog de Edição de Períodos
   ** Se apenas um item estiver selecionado no DataTable, preenche o Objeto modelItemCost
   ** Se mais de um item estiver selecionado no DataTable, preenche a Lista modelItemCostList */
  openAdjustementPeriodDialog() {
    this.showAdjustementPeriodDialog = true;
  }

  /** Abre o Dialog para Duplicar registros
   ** Se apenas um item estiver selecionado no DataTable, preenche o Objeto modelItemCost
   ** Se mais de um item estiver selecionado no DataTable, preenche a Lista modelItemCostList */
  openDuplicationDialog() {
    this.showDuplicationDialog = true;
  }

  /** Validação que ocorre nos Dialogs de Edição de Períodos e de Duplicar para saber se as novas datas
   ** não irão se sobrepor com as datas de registros já existentes para os respectivos Itens e Modelos 
   ** @isDuplication: flag que indica que  validação foi chamada pelo Dialog de Duplicar
                      Se for false, então a chamada veio do Dialog de Editar Período */
  validateAdjustment(isDuplication: boolean) {
    if (this.modelItemCostEditList.length == 1) {
      this.modelItemCostAdjustementDialog.modelItemCost = { ... this.modelItemCostEditList[0] };
    } else {
      this.modelItemCostAdjustementDialog.modelItemCostList = new Array<ModelItemCost>();
      this.modelItemCostEditList.forEach(modelItemCost => {
        /* Validação para nao permitir mais de um do mesmo registro e evitar sobreposição de datas */
        if (!this.modelItemCostAdjustementDialog.modelItemCostList.find(duplicatedId =>  {
            return duplicatedId.item.id == modelItemCost.item.id
              && duplicatedId.brand?.id == modelItemCost.brand?.id
              && duplicatedId.itemModel?.id == modelItemCost.itemModel?.id
              && duplicatedId.allBrands == modelItemCost.allBrands
              && duplicatedId.allModels == modelItemCost.allModels
        })) {
          this.modelItemCostAdjustementDialog.modelItemCostList.push({...modelItemCost})
        }
      });
    }
    let validateList = new Array<ModelItemCost>();
    if (this.modelItemCostAdjustementDialog.modelItemCost) {
      validateList.push(this.modelItemCostAdjustementDialog.modelItemCost);
    } else {
      validateList = this.modelItemCostAdjustementDialog.modelItemCostList;
    }
    validateList.map(modelItemCostValidate => {
      /* Se for Duplicação, zera o ID para slavar novos registros no banco */
      if (isDuplication) {
        modelItemCostValidate.id = null;
      }
      /* Datas sempre serão obrigatórias nos Dialogs de Duplicação e Edição de Períodos */
      modelItemCostValidate.startDate = this.modelItemCostAdjustementDialog.startDate;
      modelItemCostValidate.endDate = this.modelItemCostAdjustementDialog.endDate;
      if (isDuplication) {
        /* Se a ação for de Redefinição, o valor Monetário digitado será utilizado como o valor do Custo para estes itens */
        if (this.modelItemCostAdjustementDialog.action == 'reset') {
          modelItemCostValidate.price = this.modelItemCostAdjustementDialog.monetaryValue;
        } else {
          /* Se a ação for de ajuste Monetário, somar o valor atual de cada item com o novo valor monetário informado */
          if (this.modelItemCostAdjustementDialog.adjustement == 'monetary') {
            modelItemCostValidate.price += this.modelItemCostAdjustementDialog.monetaryValue;
          } else {
            /* Se a ação for de ajuste Percentual, adiciona o valor do percentual informado referente ao valor atual de cada item */
            modelItemCostValidate.price = modelItemCostValidate.price * (this.modelItemCostAdjustementDialog.percentValue / 100);
          }
        }
      }
    })
    this.modelItemCostService.validateList(validateList).pipe().subscribe(data => {
      this.modelItemCostErrorList = data.filter(modelItemCost => modelItemCost.hasValidationError);
      if (this.modelItemCostErrorList.length > 0) {
        this.modelItemCostErrorList.forEach(modelItemCost => {
          modelItemCost.startDate = new Date(modelItemCost.startDate);
          modelItemCost.endDate = new Date(modelItemCost.endDate);
        });
        this.showValidateTab = true;
        this.messageService.add({ key: 'tst', severity: 'warn', summary: 'Validação relizada!', detail: `Alguns registros não passaram na validação!` });
      } else {
        /* Se for o Dialog de Duplicar */
        if (isDuplication) {
          this.saveDuplication(validateList);
        } else {
          /* Se não for, então é o Dialog de Editar Período */
          this.saveAdjustementPeriod(validateList);
        }
      }      
    }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  /** Salva os ajustes do Dialog de Edição de Valor */
  saveAdjustementPrice() {
    if (this.modelItemCostEditList.length == 1) {
      this.modelItemCostAdjustementDialog.modelItemCost = { ... this.modelItemCostEditList[0] };
    } else {
      this.modelItemCostAdjustementDialog.modelItemCostList = [... this.modelItemCostEditList];
    }
    let adjustementPriceList = new Array<ModelItemCost>();
    if (this.modelItemCostAdjustementDialog.modelItemCost) {
      adjustementPriceList.push(this.modelItemCostAdjustementDialog.modelItemCost);
    } else {
      adjustementPriceList = this.modelItemCostAdjustementDialog.modelItemCostList;
    }
    adjustementPriceList.map(modelItemCostUpdate => {
      /* Se a ação for de Redefinição, o valor Monetário digitado será utilizado como o valor do Custo para estes itens */
      if (this.modelItemCostAdjustementDialog.action == 'reset') {
        modelItemCostUpdate.price = this.modelItemCostAdjustementDialog.monetaryValue;
      } else {
        /* Se a ação for de ajuste Monetário, somar o valor atual de cada item com o novo valor monetário informado */
        if (this.modelItemCostAdjustementDialog.adjustement == 'monetary') {
          modelItemCostUpdate.price += this.modelItemCostAdjustementDialog.monetaryValue;
        } else {
          /* Se a ação for de ajuste Percentual, adiciona o valor do percentual informado referente ao valor atual de cada item */
          modelItemCostUpdate.price *= this.modelItemCostAdjustementDialog.percentValue / 100;
        }
      }
    })
    this.modelItemCostService.updateList(adjustementPriceList).pipe().subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registros atualizados com sucesso!` });    
      this.initDialogs(true);
      this.initSearchForm(true);
      this.initRegisterForm();
    }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  /** Salva os ajustes do Dialog de Edição de Período */
  saveAdjustementPeriod(adjustementPeriodList: ModelItemCost[]) {
    this.modelItemCostService.updateList(adjustementPeriodList).pipe().subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registros atualizados com sucesso!` });    
      this.initDialogs(true);
      this.initSearchForm(true);
      this.initRegisterForm();
    }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  /** Salva os novos registros do Dialog de Duplicar */
  saveDuplication(duplicationList: ModelItemCost[]) {
    this.modelItemCostService.saveList(duplicationList).pipe().subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registros adicionados com sucesso!` });    
      this.initDialogs(true);
      this.initSearchForm(true);
      this.initRegisterForm();
    }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  /** Salva um novo registro através do formulário de cadastro */
  save() {
    let method = this.modelItemCostRegister.id ? 'update' : 'save';
    let message = this.modelItemCostRegister.id ? 'atualizado' : 'adicionado';

    this.modelItemCostRegister.item = this.itemRegister;
    this.modelItemCostRegister.brand = this.brandRegister;
    this.modelItemCostRegister.itemModel = this.modelYearRangeRegister;
    this.modelItemCostService[method](this.modelItemCostRegister).pipe().subscribe(data => {
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Salvo com sucesso', detail: `Registro ${message} com sucesso!` });    
      this.initSearchForm(true);
      this.initRegisterForm();
    }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  /** Ao selecionar apenas uma linha no DataTable, preenche os dados do respectivo item no formulário de Cadastro e habilita a edição */
  edit() {
    this.isEdit = true;
    let modelItemCostEdit = this.modelItemCostEditList[0];
    this.modelItemCostService.getById(modelItemCostEdit.id).pipe(first()).subscribe(data => {
      this.modelItemCostRegister = {... data};
      this.modelItemCostRegister.startDate = new Date(this.modelItemCostRegister.startDate);
      this.modelItemCostRegister.endDate = new Date(this.modelItemCostRegister.endDate);
      this.itemRegister = this.itemListGlobal.find(item => item.id == data.item.id);
      this.brandRegister = {... data?.brand};
      this.modelRegister = {... data?.itemModel?.model};
      this.modelYearRangeRegister = {... data?.itemModel};
      this.loadItemModelListRegisterByItem(this.itemRegister);
    }, error => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
    });
  }

  /** Valida as ações de selecionar e desmarcar checkboxes no DataTable
   ** Se apenas um for selecionado, é chamada a ação de editar
   ** Se nenhum ou mais de um for selecionado, não permite a edição através do formulário de cadastro e limpa o mesmo */
  onSelectionChange() {
    if (this.modelItemCostEditList.length != 1) {
      this.initRegisterForm();
    } else {
      this.edit();
    }
  }

  /** Quando o botão Cancelar é acionado durante uma edição no formulário de Cadastro 
   ** então este item é desmacado do DataTable */
  cancelEdit() {
    this.modelItemCostEditList = new Array<ModelItemCost>();
  }

  /** Remove um registro do banco de dados */
  remove(modelItemCost: ModelItemCost) {
    this.confirmationService.confirm({
      message: `Deseja remover o Custo por Modelo do Item: ${modelItemCost?.item?.name}?`,
      header: 'Excluir registro',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.modelItemCostService.delete
          (modelItemCost.id).pipe(first()).subscribe(data => {
            this.messageService.add({ key: 'tst', severity: 'info', summary: 'Removido com sucesso', detail: 'Registro removido com sucesso!' });
            this.initSearchForm(true);
            this.initRegisterForm();
          }, error => {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
          });
      }
    })
  }

  /** Duplica um registro através do formulário de cadastro, gerando um novo registro com um novo período */
  duplicar() {
    this.modelItemCostRegister.id = null;
    this.modelItemCostRegister.startDate = new Date(this.modelItemCostRegister.endDate);
    this.modelItemCostRegister.startDate.setDate(this.modelItemCostRegister.startDate.getDate() + 1)
    this.modelItemCostRegister.endDate = null;
  }

  /** Pesquisa por registros de acordo com os filtros selecionados e exibe no DataTable */
  search(event) {
    /* Reseta a paginação do DataTable para a primeira página quando uma nova busca for realizada */
    if (this.dt) this.dt._first = 0;
    /* Se não preencher nenhum filtro, buscar todos os registros para listar no DataTable */
    if (!this.itemSearch && !this.brandSearch && !this.modelSearch && !this.dateSearch) {
      this.loadModelItemCostDataTable();
    } else {
      /* Se preencher qualquer ou todos os filtros, buscar os registros correspondentes para listar no DataTable */
      let modelItemCostFilter = new ModelItemCost();
      modelItemCostFilter.item = this.itemSearch;
      modelItemCostFilter.brand = this.brandSearch;
      modelItemCostFilter.itemModel = new ItemModel();
      modelItemCostFilter.itemModel.model = this.modelSearch;
      modelItemCostFilter.dateFilter = this.dateSearch;
      this.modelItemCostService.search(modelItemCostFilter).pipe(first()).subscribe(data => {
        this.modelItemCostList  = data.map(modelItemCost => {
          return {
            ...modelItemCost,
            startDate: new Date(modelItemCost.startDate),
            endDate: new Date(modelItemCost.endDate)
          }
        });
      }, error => {
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Erro', detail: error });
      });
    }
  }
}

