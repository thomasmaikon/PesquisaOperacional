import { useState } from "react"
const maiorMenor = {
  nada: 0,
  maior: 1,
  menor: -1
}

export default function Home() {

  const [funcaObjetivo, setFuncaoObjetivo] = useState([0, 0])
  const [maximiza, setMaximiza] = useState(maiorMenor.maior)

  const [restricoes, setRestricoes] = useState([])

  const [limiteRestricao, setLimiteRestricao] = useState([])
  const [maiorOuMenorRestricao, setMaiorOuMenorRestricao] = useState([])

  function exibirValoresEmFormaMatematica(vetorValores) {
    let quantidadeOperacoes = vetorValores.length - 1 // sempre é assim, ex: 50 + 2 + 3 = 2 operacoes
    return vetorValores.map((value, index) => {
      --quantidadeOperacoes
      return (
        <span key={index}>
          <input className="max-w-[10%] p-2 m-2 rounded-2xl shadow-md"
          type={"number"} value={value} onChange={event => atualizarValorFuncaoObjetivo(event.target.value, index)} />
          <math>
            <mrow>
              <msub>
                <mi>X</mi>
                <mn>{index}</mn>
              </msub>
              {quantidadeOperacoes >= 0 ? <mo>+</mo> : <mo></mo>}
            </mrow>
          </math>
        </span>
      )
    })
  }

  function atualizarValorFuncaoObjetivo(novoValor, index) {
    const copia = [...funcaObjetivo]
    copia[index] = novoValor
    setFuncaoObjetivo(copia)
  }

  function adicionarVariaveisFuncaoObjetivo() {
    const copia = [...funcaObjetivo]
    copia.push(0)
    setFuncaoObjetivo(copia)
  }

  function exibirRestricoes(matrizRestricoes) {
    const result = matrizRestricoes.map((linha, index) => {
      return (
        <div key={index} className="p-2 m-2">
          <math  className="mr-3">
            <mrow> <msub> <mi>R</mi> <mn>{index}</mn> </msub> </mrow>
          </math>
          {exibirRestricoesEmFormaMatematica(linha, index)}
          <select className="button-55"
          name="menoroumanior" defaultValue={1} onChange={e => atualizarMaiorMenorRestricao(e.target.value, index)}>
            <option value={1}> {">="} </option>
            <option value={-1}> {"<="} </option>
          </select>
          <input className="max-w-[10%] p-2 m-2 rounded-2xl shadow-md"
          key={index} type={"number"} value={limiteRestricao[index]} onChange={e => atualizarValorLimiteRestricao(e.target.value, index)} />
        </div>
      )
    })

    return result
  }

  function exibirRestricoesEmFormaMatematica(vetorValores, indiceLinhaX) {
    let quantidadeOperacoes = vetorValores.length - 1 // sempre é assim, ex: 50 + 2 + 3 = 2 operacoes
    return vetorValores.map((value, indiceLinhaY) => {
      --quantidadeOperacoes
      return (
        <span key={indiceLinhaY} >
          <input className="max-w-[10%] p-2 m-2 rounded-2xl shadow-md"
          type={"number"} value={value} onChange={event => atualizarValorRestricao(event.target.value, indiceLinhaX, indiceLinhaY)} />
          <math>
            <mrow>
              <msub>
                <mi>X</mi>
                <mn>{indiceLinhaY}</mn>
              </msub>
              {quantidadeOperacoes >= 0 ? <mo>+</mo> : <mo></mo>}
            </mrow>
          </math>
        </span>
      )
    })
  }

  function atualizarValorRestricao(novoValor, x, y) {
    const copiaMatrizRestricao = [...restricoes]
    copiaMatrizRestricao[x][y] = novoValor
    setRestricoes(copiaMatrizRestricao)
  }

  function adicionarRestricao() {
    debugger
    const copiaRestricoes = [...restricoes]
    let vet = []
    funcaObjetivo.map((valor, index) => { vet.push(maiorMenor.nada) })
    copiaRestricoes.push(vet)
    setRestricoes(copiaRestricoes)

    const copiaLimiteRestricao = [...limiteRestricao]
    copiaLimiteRestricao.push(0)
    setLimiteRestricao(copiaLimiteRestricao)

    const copiaMaiorOuMenor = [...maiorOuMenorRestricao]
    copiaMaiorOuMenor.push(maiorMenor.maior)
    setMaiorOuMenorRestricao(copiaMaiorOuMenor)
  }

  function atualizarValorLimiteRestricao(novoValor, indice) {
    const copiaLimites = [...limiteRestricao]
    copiaLimites[indice] = novoValor
    setLimiteRestricao(copiaLimites)
  }

  function atualizarMaiorMenorRestricao(novoValor, indice) {
    const copiaMaiorMenor = [...maiorOuMenorRestricao]
    copiaMaiorMenor[indice] = novoValor
    setMaiorOuMenorRestricao(copiaMaiorMenor)
  }

  function atualizaMaiorMenorFuncaoObjetivo(valor) {
    let copia = maximiza
    copia = valor
    setMaximiza(copia)
  }

  function generateFuncaoObjetivoDualidade() {
    let quantidadeOperacoes = limiteRestricao.length - 1 // sempre é assim, ex: 50 + 2 + 3 = 2 operacoes
    const resultado = limiteRestricao.map((value, index) => {
      --quantidadeOperacoes
      return (
        <>
          <math key={index}>
            <mrow>
              <msub>
                <mi>{value}</mi>
                <mi>Y</mi>
                <mn>{index}</mn>
              </msub>
              {quantidadeOperacoes >= 0 ? <mo>+</mo> : <mo></mo>}
            </mrow>
          </math>
        </>
      )
    })
    // a seguir eu faco o processo de inversao do que sera exibido
    return (
      <>
        {maximiza >= 1 ? 'MinZ = ' : 'MaxZ = '}
        {resultado}
      </>
    )
  }

  function gerarRestricoesDualidade() {
    let transposta = gerarTransposta(restricoes)
    if (transposta == [])
      return
    // realiza a mesma operacao de inversao que acontece com a funcao objetivo
    const result = transposta.map((linha, index) => {
      if (linha == [])
        return
      return (
        <div key={index}>
          <math className="mr-3">
            <mrow> <msub> <mi>R</mi> <mn>{index}</mn> </msub> </mrow>
          </math>
          {exibirRestricoesEmFormaMatematicaSemInput(linha, index)}
          {maiorOuMenorRestricao[index] == maiorMenor.maior ?  " <= " : " >= "}
          {funcaObjetivo[index]}
        </div>
      )
    })
    return result
  }

  function gerarTransposta(matrix) {
    debugger
    if (matrix == 0)
      return []

    const linhas = matrix.length
    const colunas = matrix[0].length
    let arr = new Array(colunas)

    for (let i = 0; i < colunas; i++) {
      arr[i] = new Array(linhas)
    }

    for (let i = 0; i < linhas; i++) {
      for (let j = 0; j < colunas; j++) {
        arr[j][i] = matrix[i][j];
      };
    }
    return arr;
  }

  function exibirRestricoesEmFormaMatematicaSemInput(vetorValores, indiceLinhaX) {
    debugger
    let quantidadeOperacoes = vetorValores.length - 1 // sempre é assim, ex: 50 + 2 + 3 = 2 operacoes
    return vetorValores.map((value, indiceLinhaY) => {
      --quantidadeOperacoes
      return (
        <>
          {value}
          <math key={indiceLinhaY}>
            <mrow>
              <msub>
                <mi>Y</mi>
                <mn>{indiceLinhaY}</mn>
              </msub>
              {quantidadeOperacoes >= 0 ? <mo>+</mo> : <mo></mo>}
            </mrow>
          </math>
        </>
      )
    })
  }

  return (
    <>
      <div>
        <div className="flex flex-col justify-center items-center shadow-lg rounded-lg" 
        style={{ backgroundColor: 'yellow'}}>
          <div className="p-8 text-2xl"> Funcao objetivo </div>
          <div className="rounded-lg border-slate-300">
            <select className="button-55"
            name="select" defaultValue={1} onChange={e => atualizaMaiorMenorFuncaoObjetivo(e.target.value)}>
              <option value={1}> MaxZ </option>
              <option value={-1}> MinZ </option>
            </select>
            <i> = </i>
            {exibirValoresEmFormaMatematica(funcaObjetivo)}
            <section className="p-5">
              <input className="button-55"
              type={"button"} value={"Adicionar Variavel"} onClick={() => adicionarVariaveisFuncaoObjetivo()} />
            </section>
          </div>
        </div>

        <br />

        <div className="flex flex-col justify-center items-center shadow-lg rounded-lg" 
        style={{backgroundColor: 'orange'}}>
          <div className="p-8 text-2xl"> Restrições </div>
          {exibirRestricoes(restricoes)}
          <section className="p-5">
            <input className="button-55"
            type={"button"} value={"Adicionar Restrição"} onClick={() => adicionarRestricao()} />
          </section>
        </div>

        <br />

        <div className="flex flex-col justify-center items-center shadow-lg rounded-lg"
        style={{backgroundColor:'#ffcb9b'}}>
          <div className="p-8 text-2xl">
            Resultado
          </div>

          <div className="flex text-2xl" style={{backgroundColor:'#ffb16f'}}>
            <div className="shadow-lg rounded-lg min-w-[300px] p-3 m-3">
              <section>
                Funcao Objetivo
              </section>
              {generateFuncaoObjetivoDualidade()}
            </div>

            <div className="shadow-lg rounded-lg min-w-[300px] p-3 m-3">
              <div>
                Restrições
              </div>
              {gerarRestricoesDualidade()}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
