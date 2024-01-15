const btnAdicionarTarefa = document.querySelector(".app__button--add-task");
const formAdicionarTarefa = document.querySelector(".app__form-add-task");
const textArea = document.querySelector(".app__form-textarea");
const ulTarefas = document.querySelector(".app__section-task-list");
const btCancelar = document.querySelector(".app__form-footer__button--cancel");
const paragrafoDescricaoTarefa = document.querySelector(".app__section-active-task-description");
const btnRemoverConcluidas = document.querySelector("#btn-remover-concluidas");
const btnRemoverTodas = document.querySelector("#btn-remover-todas");

//Aqui estamos já abrindo a lista de tarefas buscando no localStorage se já tem algo salvo
//Vamos usar o JSON.parse para converter a string do localStorage em um objeto
//Vamos também implementar um OU || - Caso a localStorage esteja vazia vai retornar um lista vazia para trabalharmos
let listaTarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

let tarefaSelecionada = null;
let liTarefaSelecionada = null;

//Aqui estamos criando uma função para atualizar as tarefas
function atualizarTarefas () {

    //Inserção de um ítem no localStorage
    //O primeiro parâmetro é o nome que vamos escolher para guardar estes dados
    //O segundo parâmetro é o que será inserido (neste caso a lista de tarefas)
    //como o localStorage só aceita strings, precisamos usar a api JSON.stringfy para transformar este objeto em uma string
    localStorage.setItem("tarefas", JSON.stringify(listaTarefas));


}

btCancelar.addEventListener("click", () => {

    textArea.textContent = "";
    formAdicionarTarefa.classList.add("hidden");
})

//Aqui vamos criar um código para inserir no HTML cada tarefa que for criada
function criarElementoTarefa(tarefa) {

    //Começamos criando um ítem da lista terafas
    const li = document.createElement("li");

    //Aqui adicionamos a este ítem uma classe do CSS
    li.classList.add("app__section-task-list-item");

    //Aqui criamos um elemento SVG para inserir uma imagem
    const svg = document.createElement("svg");

    //Aqui inserimos no HTML o código para esta imagem
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>

    `
    //Aqui criamos o parágrado onde vari estar a descrição da tarefa
    const paragrafo = document.createElement("p");
    paragrafo.classList.add("app__section-task-list-item-description");
    paragrafo.textContent = tarefa.descricao;

    //Aqui criamos o botão e a imagem do botão
    const botao = document.createElement("button");
    botao.classList.add("app_button-edit");
    const imgBotao = document.createElement("img");
    
    //Aqui nós capturamos o botão e sobrescrevemos a propriedade onclick para poder abrir a opção de editar a tarefa
    botao.onclick = () => {

        //Aqui vamos abrir um prompt para o usuário alterar a descrição da tarefa
        const novaDescricao = prompt("Qual é o novo nome da Tarefa?");

        //Aqui vamos criar uma condicional para confirmar se foi inserido algum valor no prompt
        if (novaDescricao) {
            //Aqui estamos inserindo o valor informado no prompt no paragrafo que aparece na tela
        paragrafo.textContent = novaDescricao;
        //Aqui estamos informando o novo valor que será alterado no Objeto tarefa (camada de dados)
        tarefa.descricao = novaDescricao;
        //Aqui chamamos a função atualizaTarefas para atualizar o localStorage
        atualizarTarefas();

        }
        
    }

    //Aqui colocamos o destino da Imagem do Botão
    imgBotao.setAttribute("src", "./imagens/edit.png");

    //Agora vamos organizar os elementos
    //Começando incluindo a imagem do botão no botão
    botao.append(imgBotao);

    //Agora organizando todos os elementos no ítem da lista
    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    //Aqui vamos criar uma função SE para conferir se a tarefa já está completa
    if (tarefa.completa) {

        li.classList.add("app__section-task-list-item-complete");
       botao.setAttribute("disabled", "disable");


    } else {

        //Aqui estamos usando para ativar a opção em Andamento da Tarefa ao clique sobre ela
        li.onclick = () => {
    
            //Aqui estamos cuidando para que ao selecionar uma tarefas as outras sejam descelecionadas (retirada a classe que dá a seleção[borda branca])
            document.querySelectorAll(".app__section-task-list-item-active")
            .forEach (elemento => {
                //aqui removemos de cada elemento deste array esta classe para ao clique descelecionar a tarefa clicada anteriormente
             elemento.classList.remove("app__section-task-list-item-active");
                
            })
    
            //Aqui estamos fazendo uma verificação, pois se clicarmos na tarefa que já estava selecionada queremos desceleciona-la
            if (tarefaSelecionada == tarefa) {
    
                paragrafoDescricaoTarefa.textContent = "";
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return;
                //Este return interrom o onclick e não deixa executar o restante do código
            }
            
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
            //Aqui estamos selecionando para mostrar a descrição da Tarefa clicada na parte Em Andamento
            paragrafoDescricaoTarefa.textContent = tarefa.descricao;  
    
            //Aqui estamos adicionando o destaque na tarefa clicada (bora branca)
            li.classList.add("app__section-task-list-item-active");
    
        }
            
    }


    //Aqui vamos definir o retorno da função para que ela retorne o "li" que foi criado
    return li;
}

//addEventListener => Adiciona um evento após escutar um ação
btnAdicionarTarefa.addEventListener("click", () => {
    //toggle => Método para alternar entre a classe
    formAdicionarTarefa.classList.toggle("hidden");
})

formAdicionarTarefa.addEventListener("submit", (evento) => {
    
    //preventDefault => Previne o comportamento padrão
    //Neste caso o botão salvar dava um refresh na página ou fazia a submissão natural do formulário
    evento.preventDefault();

    //Aqui estamos criando um objeto para receber o valor da tarefa
    const tarefa = {

        descricao: textArea.value,

    }

    //inclusão da tarefa na lista de tarefas com o push
    listaTarefas.push(tarefa);

    //Aqui estamos exibindo na tela a tarefa que acabou de ser criada
    const elementoTarefaNaTela = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefaNaTela);
    //O append adiciona multiplos nós ou strings ao final de um elemento

    //Inserção de um ítem no localStorage
    atualizarTarefas();
    //Após incluir a nova tarefa no local storage e exibir na tela vamos limpar o campo de descrição da tarefa e esconder o formulário e criação da tarefa
    textArea.value = "";
    formAdicionarTarefa.classList.add("hidden");


})

//Aqui estamos chamando a lista de tarefas para aplicar uma função a data elemento
listaTarefas.forEach(tarefa => {
   
    //Aqui estamos criando uma const que vai conter a função que cria o elemento tarefa e recebe uma tarefa da lista
    const elementoTarefa = criarElementoTarefa(tarefa);

    //Aqui vamos incluir o item tarefa em uma lista "ul"vazia do HTML
    ulTarefas.append(elementoTarefa);
});

//Aqui vamos fazer o DOM verificar se o evento aconteceu
document.addEventListener("FocoFinalizado", () => {
    if (tarefaSelecionada && liTarefaSelecionada) {

        liTarefaSelecionada.classList.remove("app__section-task-list-item-active");
        liTarefaSelecionada.classList.add("app__section-task-list-item-complete");
        liTarefaSelecionada.querySelector("button").setAttribute("disabled", "disable");

        tarefaSelecionada.completa = true;
        atualizarTarefas()
    }

});

//Criando uma função para o clique no botão remover tarefas concluídas
const removerTarefas = (somenteCompletas) => {

    //const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";
    
    let seletor = ".app__section-task-list-item";
    if (somenteCompletas) {
        seletor = ".app__section-task-list-item-complete"
    }
    
    document.querySelectorAll(seletor).forEach(elemento => {

        elemento.remove();


    })

    //Atualizando as tarefas do LocalStorafe para mostrar apenas a que não foram completas
    listaTarefas = somenteCompletas ? listaTarefas.filter(tarefa => !tarefa.completa) : [];
    atualizarTarefas();

}

btnRemoverConcluidas.onclick = () => removerTarefas(true);

btnRemoverTodas.onclick = () => removerTarefas(false);