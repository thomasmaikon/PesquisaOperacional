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
        <>
          <input key={index} type={"number"} value={value} onChange={event => atualizarValorFuncaoObjetivo(event.target.value, index)} />
          <math>
            <mrow>
              <msub>
                <mi>X</mi>
                <mn>{index}</mn>
              </msub>
              {quantidadeOperacoes >= 0 ? <mo>+</mo> : <mo></mo>}
            </mrow>
          </math>
        </>
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
        <div key={index}>
          <math>
            <mrow> <msub> <mi>R</mi> <mn>{index}</mn> </msub> </mrow>
          </math>
          {exibirRestricoesEmFormaMatematica(linha, index)}
          <select name="menoroumanior" onChange={e => atualizarMaiorMenorRestricao(e.target.value, index)}>
            <option value={1} selected> {">="} </option>
            <option value={-1}> {"<="} </option>
          </select>
          <input key={index} type={"number"} value={limiteRestricao[index]} onChange={e => atualizarValorLimiteRestricao(e.target.value, index)} />
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
        <>
          <input key={indiceLinhaY} type={"number"} value={value} onChange={event => atualizarValorRestricao(event.target.value, indiceLinhaX, indiceLinhaY)} />
          <math>
            <mrow>
              <msub>
                <mi>X</mi>
                <mn>{indiceLinhaY}</mn>
              </msub>
              {quantidadeOperacoes >= 0 ? <mo>+</mo> : <mo></mo>}
            </mrow>
          </math>
        </>
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
          <math>
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
          <math>
            <mrow> <msub> <mi>R</mi> <mn>{index}</mn> </msub> </mrow>
          </math>
          {exibirRestricoesEmFormaMatematicaSemInput(linha, index)}
          {maiorOuMenorRestricao[index] == maiorMenor.maior ? "<=" : ">=" }
          {funcaObjetivo[index]}
        </div>
      )
    })
    return result
  }

  function gerarTransposta(matrix) {
    debugger
    if ( matrix == 0)
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
          <math>
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
        <div>
          <section> Funcao objetivo: </section>
          <select name="select" onChange={e => atualizaMaiorMenorFuncaoObjetivo(e.target.value)}>
            <option value={1} selected> MaxZ </option>
            <option value={-1}> MinZ </option>
          </select>
          <i> = </i>
          {exibirValoresEmFormaMatematica(funcaObjetivo)}
          <section>
            <input type={"button"} value={"Adicionar Variavel"} onClick={() => adicionarVariaveisFuncaoObjetivo()} />
          </section>
        </div>

        <br />

        <div>
          <section> Restrições: </section>
          {exibirRestricoes(restricoes)}
          <section>
            <input type={"button"} value={"Adicionar Restrição"} onClick={() => adicionarRestricao()} />
          </section>
        </div>

        <br />

        <div>
          <section>
            Resultado:
          </section>

          <div>
            <div>
              <section>
                Funcao Objetivo:
              </section>
              {generateFuncaoObjetivoDualidade()}
            </div>

            <div>
              <section>
                Restrições:
              </section>
              {gerarRestricoesDualidade()}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
