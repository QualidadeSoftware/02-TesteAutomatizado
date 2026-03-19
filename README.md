# Roteiro de Atividade: Automação de Testes com Playwright

**Pré-requisitos:** Noções básicas de teste de software, familiaridade com terminal/linha de comando

---

## 1. Objetivos de Aprendizagem

Ao final desta atividade, o aluno deverá ser capaz de:

- Relembrar e aplicar os conceitos fundamentais de teste de software no contexto da automação.
- Compreender o papel da automação de testes dentro do ciclo de vida do desenvolvimento moderno.
- Instalar, configurar e utilizar o Playwright como ferramenta de automação de testes end-to-end (E2E).
- Escrever, executar e interpretar testes automatizados para aplicações web reais.
- Identificar defeitos de implementação em aplicações web por meio de testes automatizados.
- Analisar relatórios de teste gerados pelo Playwright e propor melhorias com base nos resultados.

---

## 2. Revisão Teórica — Fundamentos de Teste de Software

Antes de mergulhar na prática, é essencial revisitar os conceitos que sustentam qualquer estratégia de automação. Esta seção deve ser conduzida de forma dialogada, incentivando a participação dos alunos.

### 2.1 O que é Teste de Software?

Teste de software é o processo de avaliar um sistema ou componente com o objetivo de verificar se ele atende aos requisitos especificados e identificar defeitos. Envolve a execução de um programa sob condições controladas e a comparação dos resultados obtidos com os resultados esperados.

**Pergunta disparadora para a turma:** *"Se vocês tivessem que testar um aplicativo de e-commerce antes de ele ir ao ar, por onde começariam? O que verificariam?"*

### 2.2 Níveis de Teste

Relembrando a Pirâmide de Testes, os níveis se organizam da seguinte forma:

```
        /‾‾‾‾‾‾‾‾‾‾‾\
       /   E2E / UI   \        ← Poucos, lentos, caros (é aqui que o Playwright atua)
      /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
     /    Integração     \    ← Quantidade intermediária
    /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
   /       Unitários        \  ← Muitos, rápidos, baratos
  /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
```

- **Testes Unitários:** Validam unidades isoladas de código (funções, métodos). São rápidos e baratos.
- **Testes de Integração:** Verificam a comunicação entre módulos ou serviços.
- **Testes End-to-End (E2E):** Simulam o comportamento real do usuário em toda a aplicação. São mais lentos e custosos, porém validam fluxos completos.

### 2.3 Por que Automatizar?

A automação de testes oferece benefícios concretos que justificam o investimento inicial:

- **Repetibilidade:** testes executados da mesma forma, sempre, sem fadiga humana.
- **Velocidade:** suítes completas rodam em minutos, viabilizando feedback rápido em pipelines CI/CD.
- **Cobertura de regressão:** garantia de que funcionalidades existentes não quebraram após novas alterações.
- **Documentação viva:** os scripts de teste descrevem o comportamento esperado do sistema.

### 2.4 Quando NÃO Automatizar?

Nem tudo deve ser automatizado. É importante que os alunos compreendam que:

- Testes exploratórios e de usabilidade dependem de percepção humana.
- Funcionalidades instáveis ou em constante mudança geram testes frágeis (*flaky tests*).
- O custo de manutenção dos testes deve ser considerado na decisão.

**Reflexão para a turma:** *"Automatizar tudo é viável? Qual seria o critério de decisão para escolher o que automatizar primeiro?"*

---

## 3. Introdução ao Playwright

### 3.1 O que é o Playwright?

O Playwright é um framework de automação de testes E2E desenvolvido pela Microsoft. Ele permite escrever testes que controlam navegadores reais (Chromium, Firefox e WebKit) de forma programática.

Características que o tornam relevante para o aprendizado:

- Suporte nativo a múltiplos navegadores (*cross-browser testing*).
- API moderna e intuitiva com *auto-wait* (espera automática por elementos).
- Geração automática de código via *Codegen*.
- Relatórios HTML integrados e rastreamento visual (*Trace Viewer*).
- Suporte a linguagens: JavaScript/TypeScript, Python, Java e C#.

### 3.2 Playwright vs. Outras Ferramentas

| Característica         | Playwright         | Selenium           | Cypress            |
|------------------------|--------------------|--------------------|--------------------|
| Multi-browser nativo   | ✅ Sim             | ✅ Sim             | ⚠️ Parcial         |
| Auto-wait              | ✅ Nativo          | ❌ Manual          | ✅ Nativo          |
| Velocidade             | Rápido             | Moderado           | Rápido             |
| Geração de código      | ✅ Codegen         | ❌ Não             | ❌ Não             |
| Trace Viewer           | ✅ Sim             | ❌ Não             | ⚠️ Limitado        |
| Curva de aprendizado   | Moderada           | Alta               | Baixa              |

### 3.3 Estrutura de Testes do Playwright

Um projeto Playwright segue uma organização clara que facilita a escrita e manutenção dos testes. Compreender cada componente é fundamental para trabalhar de forma produtiva.

#### Arquivo de Configuração (`playwright.config.ts`)

Este é o arquivo central que define como os testes serão executados. Ele é gerado automaticamente durante a inicialização do projeto:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Diretório onde estão os arquivos de teste
  testDir: './tests',

  // Executa os testes de cada arquivo em paralelo
  fullyParallel: true,

  // Impede que test.only() seja commitado acidentalmente em CI
  forbidOnly: !!process.env.CI,

  // Número de tentativas em caso de falha
  retries: process.env.CI ? 2 : 0,

  // Gerador de relatórios (HTML é o padrão)
  reporter: 'html',

  // Configurações compartilhadas por todos os testes
  use: {
    // URL base — permite usar page.goto('/') em vez da URL completa
    baseURL: 'https://<seu-usuario>.github.io/02-TesteAutomatizado/',

    // Captura trace apenas na primeira tentativa após falha
    trace: 'on-first-retry',
  },

  // Navegadores onde os testes serão executados
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

**Pontos importantes da configuração:**

- **`baseURL`**: Ao definir esta propriedade, os testes podem usar `page.goto('/')` em vez da URL completa. Facilita a troca entre ambientes (local, staging, produção).
- **`fullyParallel`**: Executa testes de arquivos diferentes simultaneamente, acelerando a suíte.
- **`retries`**: Em ambientes de CI, retenta testes que falharam para evitar falhas intermitentes (*flaky tests*).
- **`projects`**: Permite executar a mesma suíte em múltiplos navegadores com uma única configuração.

#### Estrutura de um Arquivo de Teste

Cada arquivo de teste (`.spec.ts`) segue uma estrutura padronizada. O diagrama abaixo resume os elementos:

```
arquivo.spec.ts
├── imports                  → import { test, expect } from '@playwright/test'
├── test.beforeAll()         → Executado uma vez antes de TODOS os testes (opcional)
├── test.beforeEach()        → Executado antes de CADA teste
├── test.describe()          → Agrupamento lógico de testes
│   ├── test()               → Caso de teste individual
│   ├── test()               → Caso de teste individual
│   └── ...
├── test.describe()          → Outro grupo de testes
│   └── ...
├── test.afterEach()         → Executado após CADA teste (opcional)
└── test.afterAll()          → Executado uma vez após TODOS os testes (opcional)
```

#### Principais Elementos da API

| Elemento | Descrição | Exemplo |
|----------|-----------|---------|
| `test()` | Define um caso de teste | `test('nome do teste', async ({ page }) => { ... })` |
| `expect()` | Cria uma asserção | `await expect(locator).toBeVisible()` |
| `test.describe()` | Agrupa testes relacionados | `test.describe('Login', () => { ... })` |
| `test.beforeEach()` | Executa antes de cada teste | `test.beforeEach(async ({ page }) => { ... })` |
| `test.afterEach()` | Executa após cada teste | `test.afterEach(async ({ page }) => { ... })` |
| `page` | Representa uma aba do navegador (fixture) | `await page.goto('https://...')` |
| `page.locator()` | Encontra elementos na página | `page.locator('#meu-botao')` |
| `page.getByRole()` | Encontra por papel acessível | `page.getByRole('button', { name: 'Enviar' })` |
| `page.getByText()` | Encontra por texto visível | `page.getByText('Bem-vindo')` |
| `page.getByLabel()` | Encontra por label do formulário | `page.getByLabel('Email')` |
| `page.getByPlaceholder()` | Encontra por placeholder | `page.getByPlaceholder('Digite aqui')` |
| `page.getByTestId()` | Encontra por `data-testid` | `page.getByTestId('botao-enviar')` |

#### Tipos de Locators (Seletores)

O Playwright oferece diversas formas de localizar elementos na página. A recomendação oficial é priorizar **seletores acessíveis**, que tornam os testes mais resilientes a mudanças visuais:

```typescript
// ✅ RECOMENDADOS — baseados em acessibilidade
page.getByRole('button', { name: 'Cadastrar' })    // Por papel e nome acessível
page.getByLabel('Nome do Aluno')                     // Por label do campo
page.getByText('Aprovado')                           // Por texto visível
page.getByPlaceholder('Digite seu nome')             // Por placeholder
page.getByTestId('botao-enviar')                     // Por data-testid

// ⚠️ MENOS RECOMENDADOS — mais frágeis, quebram com mudanças visuais
page.locator('#id-do-elemento')                      // Por ID CSS
page.locator('.classe-css')                          // Por classe CSS
page.locator('div > span.item')                      // Por seletor CSS complexo
```

**Por que preferir seletores acessíveis?** Seletores como `getByRole` e `getByLabel` refletem como o usuário interage com a página. Se a equipe muda classes CSS ou reorganiza o HTML sem alterar a funcionalidade, estes seletores continuam funcionando. Além disso, incentivam boas práticas de acessibilidade no código-fonte.

### 3.4 Anatomia de um Teste — Explicação Linha a Linha

Para consolidar o entendimento, vamos analisar um teste completo e explicar cada linha em detalhe. Este teste será utilizado na atividade prática com o site **QS Acadêmico** (apresentado na próxima seção):

```typescript
import { test, expect } from '@playwright/test';                          // [1]

test.describe('Cadastro de Alunos', () => {                               // [2]
  test.beforeEach(async ({ page }) => {                                   // [3]
    await page.goto('/');                                                  // [4]
  });

  test('deve cadastrar aluno com notas válidas', async ({ page }) => {    // [5]
    // Preencher o formulário
    await page.getByLabel('Nome do Aluno').fill('Maria Souza');           // [6]
    await page.getByLabel('Nota 1').fill('8');                            // [7]
    await page.getByLabel('Nota 2').fill('7');
    await page.getByLabel('Nota 3').fill('9');

    // Submeter o formulário
    await page.getByRole('button', { name: 'Cadastrar' }).click();       // [8]

    // Verificações
    const linhas = page.locator('#tabela-alunos tbody tr');               // [9]
    await expect(linhas).toHaveCount(1);                                  // [10]
    const linhaMaria = linhas.filter({ hasText: 'Maria Souza' });        // [11]
    await expect(linhaMaria).toHaveCount(1);

    // Verificar a média calculada: (8 + 7 + 9) / 3 = 8.00
    const celulaMedia = linhaMaria.first().locator('td').nth(4);         // [12]
    await expect(celulaMedia).toHaveText('8.00');                        // [13]

    // Verificar a situação (média >= 7 → Aprovado)
    await expect(linhaMaria.first().locator('.badge')).toHaveText('Aprovado'); // [14]
  });
});
```

**Explicação detalhada de cada trecho:**

| Linha | Código | Explicação |
|-------|--------|------------|
| **[1]** | `import { test, expect }` | Importa as duas funções essenciais do Playwright. `test` define casos de teste; `expect` cria asserções que verificam resultados. |
| **[2]** | `test.describe('Cadastro de Alunos', () => { })` | Agrupa testes relacionados sob um nome descritivo. No relatório HTML, os testes aparecerão agrupados sob "Cadastro de Alunos". |
| **[3]** | `test.beforeEach(async ({ page }) => { })` | Hook executado **antes de cada teste** dentro do grupo. O parâmetro `{ page }` é uma **fixture** — o Playwright cria automaticamente uma nova aba do navegador para cada teste, garantindo isolamento. |
| **[4]** | `await page.goto('/')` | Navega para a URL raiz (combinada com a `baseURL` do config). O `await` é obrigatório porque a navegação é assíncrona — o teste espera a página carregar antes de prosseguir. |
| **[5]** | `test('deve cadastrar...', async ({ page }) => { })` | Define um caso de teste individual. O nome do teste deve descrever o **comportamento esperado** (não a implementação). A função recebe a fixture `page`. |
| **[6]** | `page.getByLabel('Nome do Aluno').fill('Maria Souza')` | Localiza o campo de texto associado ao `<label>` "Nome do Aluno" e preenche com o valor. O Playwright espera automaticamente o campo estar visível e editável (*auto-wait*). |
| **[7]** | `page.getByLabel('Nota 1').fill('8')` | Mesmo padrão para os campos numéricos. Note que o valor é passado como string, mesmo sendo um campo numérico. |
| **[8]** | `page.getByRole('button', { name: 'Cadastrar' }).click()` | Encontra um botão pelo seu papel acessível (`button`) e texto visível (`Cadastrar`), e clica nele. Mais resiliente que usar seletores CSS. |
| **[9]** | `page.locator('#tabela-alunos tbody tr')` | Cria um locator que seleciona todas as linhas `<tr>` dentro do corpo da tabela. O locator é **lazy** — não busca os elementos imediatamente, apenas quando uma ação ou asserção é executada. |
| **[10]** | `await expect(linhas).toHaveCount(1)` | Asserção que verifica que existe exatamente 1 linha na tabela. O Playwright tenta novamente automaticamente (*auto-retry*) até que a condição seja atendida ou o timeout expire. |
| **[11]** | `const linhaMaria = linhas.filter({ hasText: 'Maria Souza' })` | Restringe a busca à linha da tabela que contém o nome do aluno. Isso evita ambiguidade com a mensagem de sucesso, que também contém o nome cadastrado. |
| **[12]** | `linhaMaria.first().locator('td').nth(4)` | Seleciona a 5ª célula (`nth(4)`, pois o índice começa em 0) da linha do aluno — que corresponde à coluna "Média". |
| **[13]** | `await expect(celulaMedia).toHaveText('8.00')` | Verifica que o texto da célula é exatamente "8.00". **Este teste é crucial**: ele valida se o cálculo da média está correto. |
| **[14]** | `locator('.badge').toHaveText('Aprovado')` | Verifica de forma precisa que a situação exibida na linha do aluno é "Aprovado", sem risco de casar com o card "Aprovados" nas estatísticas. |

> **💡 Conceito-chave — Fixtures:** No Playwright, `page` é uma *fixture* fornecida automaticamente a cada teste. O framework cria uma nova instância do navegador para cada teste, garantindo que um teste não interfira no outro. Isso é chamado de **isolamento de testes**.

> **💡 Conceito-chave — Auto-wait e Auto-retry:** O Playwright aguarda automaticamente que os elementos estejam prontos antes de interagir com eles. Além disso, as asserções com `expect()` tentam novamente até o timeout (padrão: 5 segundos). Isso elimina a necessidade de `sleep` ou `waitForTimeout` na maioria dos casos.

> **⚠️ Nota:** Ao executar o teste acima com o site QS Acadêmico atual, ele poderá **falhar**. Isso é esperado — o site contém um defeito intencional que será investigado na Seção 6.5.

---

## 4. O Site de Testes — QS Acadêmico

### 4.1 Sobre o Site

Para esta atividade, utilizaremos o **QS Acadêmico**, um sistema web desenvolvido especificamente para a prática de testes automatizados. O site está disponível neste repositório na pasta `docs/` e será publicado via **GitHub Pages**.

O sistema simula um **gerenciador de notas acadêmicas** onde é possível cadastrar alunos com suas notas, visualizar médias e situações, buscar por nome e remover registros.


### 4.2 Funcionalidades do Site

| Funcionalidade | Descrição |
|----------------|-----------|
| **Cadastro de aluno** | Formulário com nome e três notas (0 a 10) |
| **Cálculo de média** | Média aritmética exibida automaticamente na tabela |
| **Classificação** | Situação do aluno: Aprovado (≥ 7), Recuperação (≥ 5 e < 7), Reprovado (< 5) |
| **Busca por nome** | Campo de filtro para localizar alunos na tabela |
| **Exclusão individual** | Botão para remover um aluno específico |
| **Limpar tudo** | Remove todos os registros de uma vez (com confirmação) |
| **Estatísticas** | Cards com totais de alunos por situação |
| **Validação de dados** | Mensagens de erro para entradas inválidas |

### 4.3 Fazendo o Fork e Publicando no GitHub Pages

#### Passo 1 — Criar o Fork

1. Acesse o repositório original no GitHub desta atividade.
2. Clique no botão **Fork** no canto superior direito.
3. Mantenha o nome do repositório e clique em **Create fork**.
4. Agora você possui uma cópia do repositório na sua conta.

#### Passo 2 — Ativar o GitHub Pages

1. No seu fork, acesse **Settings** (Configurações).
2. No menu lateral, clique em **Pages**.
3. Em **Source**, selecione **Deploy from a branch**.
4. Em **Branch**, selecione `main` e a pasta `/docs`.
5. Clique em **Save**.
6. Aguarde alguns minutos. O site estará disponível em:

```
https://<seu-usuario>.github.io/02-TesteAutomatizado/
```

#### Passo 3 — Clonar o Fork Localmente

```bash
git clone https://github.com/<seu-usuario>/02-TesteAutomatizado.git
cd 02-TesteAutomatizado
```

#### Passo 4 — Verificar o Site

Abra o endereço do GitHub Pages no navegador e confirme que o site **QS Acadêmico** está funcionando. Teste manualmente: cadastre um aluno, faça uma busca, exclua um registro.

---

## 5. Preparação do Ambiente de Testes

### 5.1 Pré-requisitos de Instalação

Antes de iniciar, certifique-se de que o ambiente possui:

- **Node.js** (versão 18 ou superior): [https://nodejs.org](https://nodejs.org)
- **VS Code** (recomendado): [https://code.visualstudio.com](https://code.visualstudio.com)
- **Git** (para versionamento): [https://git-scm.com](https://git-scm.com)

Verifique a instalação no terminal:

```bash
node --version
npm --version
```

### 5.2 Criando o Projeto Playwright

Dentro do repositório clonado, crie uma pasta para os testes e inicialize o Playwright:

```bash
# Criar e acessar o diretório do projeto de testes
mkdir testes-playwright
cd testes-playwright

# Inicializar o projeto Playwright
npm init playwright@latest
```

Durante a inicialização, selecione as seguintes opções:

- Linguagem: **TypeScript** (recomendado) ou JavaScript
- Diretório de testes: **tests**
- Adicionar GitHub Actions: **Não** (por enquanto)
- Instalar navegadores: **Sim**

### 5.3 Configurando a URL Base

Após a instalação, edite o arquivo `playwright.config.ts` para apontar para o seu site no GitHub Pages:

```typescript
use: {
  // Substitua <seu-usuario> pelo seu nome de usuário do GitHub
  baseURL: 'https://<seu-usuario>.github.io/02-TesteAutomatizado/',
  trace: 'on-first-retry',
},
```

### 5.4 Estrutura do Projeto Gerada

Após a instalação, a estrutura será semelhante a:

```
testes-playwright/
├── tests/
│   └── example.spec.ts         ← Arquivo de exemplo (pode ser removido)
├── tests-examples/
│   └── demo-todo-app.spec.ts   ← Exemplo completo (referência)
├── playwright.config.ts         ← Configuração central (já editada)
├── package.json
└── package-lock.json
```

> **Nota:** A estrutura gerada pode variar conforme a versão do Playwright instalada. Versões mais recentes podem não criar a pasta `tests-examples/`. Isso não afeta a atividade.

### 5.5 Executando o Teste de Exemplo

Para validar que tudo está funcionando:

```bash
# Executar todos os testes
npx playwright test

# Executar com interface visual (modo headed)
npx playwright test --headed

# Abrir o relatório HTML
npx playwright show-report
```

**Checkpoint:** todos os alunos devem ter o relatório HTML aberto no navegador antes de prosseguir.

---

## 6. Atividade Prática — Mão na Massa

### 6.1 Parte 1: Explorando o Codegen (20 min)

O Codegen é uma ferramenta que grava as interações do usuário no navegador e gera código de teste automaticamente. É um excelente ponto de partida para iniciantes.

```bash
# Substitua <seu-usuario> pelo seu nome de usuário do GitHub
npx playwright codegen https://<seu-usuario>.github.io/02-TesteAutomatizado/
```

**Tarefa:** Com o Codegen aberto, o aluno deve realizar as seguintes ações no site QS Acadêmico:

1. Cadastrar um aluno com nome "Ana Silva" e notas 8, 7 e 9.
2. Cadastrar um segundo aluno com nome "Carlos Lima" e notas 5, 4 e 6.
3. Buscar por "Ana" no campo de filtro.
4. Limpar o filtro e excluir o segundo aluno.

Ao finalizar, o aluno deve:
- Copiar o código gerado pelo Codegen.
- Salvá-lo em `tests/qs-academico-codegen.spec.ts`. (*este arquivo não existe, você vai criá-lo*)
- Executar o teste para confirmar que funciona: `npx playwright test qs-academico-codegen --headed`

**Reflexão:** *Observe o código gerado. Que tipo de seletores o Codegen utilizou? São os mais indicados?*

### 6.2 Parte 2: Escrevendo Testes Manualmente (40 min)

Agora é hora de escrever testes com intenção e estrutura. Crie o arquivo `tests/qs-academico.spec.ts` com o seguinte conteúdo inicial:

```typescript
import { test, expect } from '@playwright/test';

test.describe('QS Acadêmico — Testes do Sistema de Notas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ========== GRUPO 1: Cadastro de Alunos ==========

  test.describe('Cadastro de Alunos', () => {

    test('deve cadastrar um aluno com dados válidos', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('João Silva');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Verificar que o aluno aparece na tabela
      const linhas = page.locator('#tabela-alunos tbody tr');
      const linhaJoao = linhas.filter({ hasText: 'João Silva' });

      await expect(linhas).toHaveCount(1);
      await expect(linhaJoao).toHaveCount(1);
    });

    test('deve exibir mensagem de sucesso após cadastro', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Ana Costa');
      await page.getByLabel('Nota 1').fill('9');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#mensagem')).toContainText('cadastrado com sucesso');
    });

    test('não deve cadastrar aluno sem nome', async ({ page }) => {
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // A tabela deve continuar sem dados reais
      await expect(page.locator('#tabela-alunos tbody td.texto-central')).toBeVisible();
    });

  });

  // ========== GRUPO 2: Cálculo de Média ==========

  test.describe('Cálculo de Média', () => {

    test('deve calcular a média aritmética das três notas', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Pedro Santos');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Média esperada: (8 + 6 + 10) / 3 = 8.00
      const celulaMedia = page.locator('#tabela-alunos tbody tr').first().locator('td').nth(4);
      await expect(celulaMedia).toHaveText('8.00');
    });

  });
});
```

> **Nota:** Evite validar nomes de alunos com `page.getByText('João Silva')` no documento inteiro. Após o cadastro, o nome também aparece na mensagem de sucesso, o que pode gerar `strict mode violation`. Prefira restringir a asserção à tabela ou à linha correspondente.

> **⚠️ Importante:** Ao executar estes testes, **alguns deles irão falhar**. Isso é esperado — o site contém um defeito intencional de implementação. A investigação e correção desse defeito será realizada na Parte 5 (Seção 6.5).

**Tarefa para o aluno — testes adicionais a implementar:**

Complementar o arquivo acima adicionando os seguintes testes. Para cada um, o aluno deve criar o teste dentro de um `test.describe` adequado:

1. **Teste de validação de notas:** Verificar que o sistema rejeita notas fora do intervalo 0–10 (por exemplo, nota = 11 ou nota = -1).
2. **Teste de busca por nome:** Cadastrar dois alunos e verificar que o filtro de busca exibe apenas o aluno correspondente ao termo digitado.
3. **Teste de exclusão:** Cadastrar um aluno, excluí-lo e verificar que a tabela ficou vazia novamente.
4. **Teste de estatísticas:** Cadastrar três alunos com situações diferentes (Aprovado, Recuperação e Reprovado) e verificar que os totais nos cards de estatísticas estão corretos.
5. **Teste de situação — Aprovado:** Cadastrar um aluno com média ≥ 7 e verificar que a situação exibida é "Aprovado".
6. **Teste de situação — Reprovado:** Cadastrar um aluno com média < 5 e verificar que a situação exibida é "Reprovado".
7. **Teste de múltiplos cadastros:** Cadastrar 3 alunos consecutivos e verificar que a tabela possui 3 linhas.
8. **Teste de situação — Recuperação:** Cadastrar um aluno com média ≥ 5 e < 7 e verificar que a situação exibida é "Recuperação".

> **💡 Dica:** Para maximizar a chance de detectar defeitos, escolha notas com valores bem diferentes entre si (por exemplo: 4, 8, 10 em vez de 7, 7, 7). Valores iguais podem mascarar problemas no cálculo da média.

### 6.3 Parte 3: Asserções e Boas Práticas (20 min)

O Playwright oferece asserções ricas que vão além da verificação de texto. Apresente os exemplos abaixo (contextualizados para o site QS Acadêmico) e peça aos alunos que os integrem nos testes:

```typescript
// Verificar visibilidade de uma seção
await expect(page.locator('#secao-cadastro')).toBeVisible();

// Verificar placeholder de um campo
await expect(page.getByLabel('Nome do Aluno')).toHaveAttribute(
  'placeholder', 'Digite o nome completo'
);

// Verificar título da página
await expect(page).toHaveTitle(/QS Acadêmico/);

// Verificar que a tabela está vazia (mensagem de placeholder)
await expect(page.getByText('Nenhum aluno cadastrado.')).toBeVisible();

// Verificar contagem de elementos
await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(3);

// Verificar que um texto NÃO está mais visível após exclusão
await expect(page.locator('#tabela-alunos tbody')).not.toContainText('João Silva');

// Verificar conteúdo de um card de estatística
await expect(page.locator('#stat-total')).toHaveText('5');
```

**Lidando com diálogos nativos (`alert`, `confirm`):**

A funcionalidade "Limpar Tudo" utiliza `window.confirm()`. Para testá-la no Playwright, registre um handler **antes** de acionar o botão:

```typescript
// Aceitar o diálogo de confirmação (equivale a clicar "OK")
page.on('dialog', async dialog => {
  await dialog.accept();
});
await page.getByRole('button', { name: 'Limpar Tudo' }).click();

// Para rejeitar (clicar "Cancelar"), use dialog.dismiss()
```

**Boas práticas a destacar:**

- Prefira seletores acessíveis (`getByRole`, `getByText`, `getByLabel`) em vez de seletores CSS frágeis.
- Evite `page.waitForTimeout()` — confie no *auto-wait* do Playwright.
- Agrupe testes relacionados com `test.describe()`.
- Use `test.beforeEach()` para eliminar repetição de setup.
- Nomeie os testes de forma descritiva: descreva o **comportamento esperado**, não a implementação.
- Mantenha cada teste **independente** — nenhum teste deve depender do resultado de outro.
- Use `await` em todas as interações e asserções — são operações assíncronas.

### 6.4 Parte 4: Trace Viewer e Depuração (20 min)

O Trace Viewer permite inspecionar cada passo do teste com screenshots, rede, console e DOM.

```bash
# Executar testes com trace habilitado
npx playwright test --trace on

# Abrir o relatório (o trace estará disponível para cada teste)
npx playwright show-report
```

No relatório HTML, clique em um teste e depois no link **Trace** para abrir o Trace Viewer. Nele é possível:

- Ver um **screenshot de cada etapa** do teste.
- Inspecionar o **DOM** no momento exato de cada ação.
- Visualizar as **requisições de rede** realizadas.
- Acompanhar o **log do console** do navegador.
- Identificar o **momento exato da falha** com destaque visual.

**Tarefa:** Execute os testes e observe quais passaram e quais falharam. Para os testes que falharam:

1. Abra o relatório HTML com `npx playwright show-report`.
2. Clique no teste que falhou para ver os detalhes.
3. Abra o Trace Viewer e navegue pelos passos.
4. Identifique **exatamente em qual asserção** o teste falhou e **qual era o valor esperado vs. obtido**.

### 6.5 Parte 5: Descobrindo o Defeito (30 min)

Este é o momento central da atividade. Se os testes foram escritos corretamente, **pelo menos um teste deve ter falhado**. Isso não é um erro do teste — é o teste cumprindo seu papel de **revelar um defeito na aplicação**.

**Roteiro de investigação:**

1. **Identificar o teste que falhou:** Observe o relatório HTML. Qual teste falhou? Qual era o valor esperado e qual foi o valor obtido?

2. **Formular uma hipótese:** Com base na diferença entre o esperado e o obtido, qual funcionalidade do sistema parece estar com defeito?

3. **Coletar evidências adicionais:** Cadastre manualmente no site um aluno com notas variadas (por exemplo: 4, 6, e 8). Calcule a média esperada manualmente e compare com o que o sistema exibe.

4. **Analisar o código-fonte:** Abra o arquivo `docs/js/app.js` e localize a função responsável pelo cálculo. Identifique o defeito no código.

5. **Documentar o defeito:** Preencha o registro abaixo:

| Campo | Descrição |
|-------|-----------|
| **Título** | (ex: "Cálculo da média ignora a terceira nota") |
| **Severidade** | Crítica / Alta / Média / Baixa |
| **Passos para reproduzir** | 1. Acessar o site... 2. Cadastrar aluno com notas... 3. Observar a média... |
| **Resultado esperado** | (o que deveria acontecer) |
| **Resultado obtido** | (o que realmente acontece) |
| **Evidência** | Screenshot do teste falhando ou do Trace Viewer |

6. **Corrigir o defeito:** Edite o arquivo `docs/js/app.js` (diretamente no github ou se fizer localmente não esqueça de commit/push), corrija a função com o defeito e salve.

7. **Reexecutar os testes:** Execute a suíte novamente e confirme que **todos os testes passam** após a correção.

```bash
# Reexecutar todos os testes
npx playwright test

# Verificar o relatório
npx playwright show-report
```

**Reflexão para a turma:** *"O defeito foi descoberto apenas quando escrevemos testes que verificavam o cálculo com valores variados. Se tivéssemos testado apenas com notas iguais (ex: 7, 7, 7), o defeito teria sido detectado? Por quê?"*

### 6.6 Problemas Comuns e Como Resolvê-los

Durante a escrita e execução dos testes, é natural encontrar erros que não são defeitos da aplicação, mas sim problemas na forma como o teste foi escrito. Esta seção lista os problemas mais frequentes e suas soluções.

#### Problema 1: "strict mode violation" — Múltiplos elementos encontrados

**Sintoma:** O teste falha com uma mensagem como:

```
Error: locator.click: Error: strict mode violation:
  getByText('Nota 1') resolved to 2 elements
```

**Causa:** O locator encontrou mais de um elemento correspondente na página. No site QS Acadêmico, isso pode acontecer porque:
- O texto "Nota 1" aparece tanto no `<label>` do formulário quanto no `<th>` da tabela de resultados.
- Após cadastrar alunos, o nome de um aluno pode aparecer tanto na tabela quanto na mensagem de sucesso.

**Soluções:**

```typescript
// ❌ PROBLEMA — "Nota 1" existe no formulário E no cabeçalho da tabela
await page.getByText('Nota 1').fill('8');

// ✅ SOLUÇÃO 1 — Usar getByLabel (associa ao <label for="nota1">)
await page.getByLabel('Nota 1').fill('8');

// ✅ SOLUÇÃO 2 — Restringir a busca a uma seção específica
await page.locator('#secao-cadastro').getByLabel('Nota 1').fill('8');

// ✅ SOLUÇÃO 3 — Usar .first() ou .nth() quando a ordem é conhecida
await page.locator('#secao-cadastro input[type="number"]').nth(0).fill('8');

// ✅ SOLUÇÃO 4 — Tornar a busca mais específica com exact: true
await page.getByText('Aprovado', { exact: true }); // Não casa com "Aprovados"
```

> **💡 Regra geral:** Sempre que o Playwright reportar "resolved to N elements", restrinja o escopo do locator em vez de simplesmente usar `.first()`. Restringir o escopo produz testes mais robustos.

#### Problema 2: Texto parcial casa com elementos indesejados

**Sintoma:** `getByText('Aprovado')` encontra tanto o badge "Aprovado" na tabela quanto o card "Aprovados" nas estatísticas.

**Causa:** Por padrão, `getByText` faz correspondência parcial — "Aprovado" é substring de "Aprovados".

**Soluções:**

```typescript
// ❌ PROBLEMA — casa com "Aprovado" e "Aprovados"
await expect(page.getByText('Aprovado')).toBeVisible();

// ✅ SOLUÇÃO 1 — Correspondência exata
await expect(page.getByText('Aprovado', { exact: true })).toBeVisible();

// ✅ SOLUÇÃO 2 — Restringir ao contexto da tabela
const linha = page.locator('#tabela-alunos tbody tr').first();
await expect(linha.getByText('Aprovado')).toBeVisible();

// ✅ SOLUÇÃO 3 — Usar o badge específico (mais preciso)
await expect(linha.locator('.badge')).toHaveText('Aprovado');
```

#### Problema 3: Teste falha por timing — elemento ainda não apareceu

**Sintoma:** O teste falha com `Timeout exceeded` ao verificar um elemento que deveria estar presente.

**Causa:** A ação anterior (ex: clique em "Cadastrar") ainda não atualizou o DOM quando a asserção é executada.

**Soluções:**

```typescript
// ❌ NÃO RECOMENDADO — espera fixa, lento e frágil
await page.waitForTimeout(2000);
await expect(page.locator('#tabela-alunos tbody')).toContainText('João');

// ✅ CORRETO — expect com auto-retry (tenta repetidamente até 5s)
await expect(page.locator('#tabela-alunos tbody')).toContainText('João');

// ✅ Se precisar de mais tempo, aumente o timeout da asserção específica
await expect(page.locator('#tabela-alunos tbody')).toContainText('João', { timeout: 10000 });
```

> **💡 Dica:** O Playwright já faz auto-retry nas asserções `expect()`. Na maioria dos casos, basta usar `await expect(...)` sem nenhum `waitFor` ou `waitForTimeout`. Se o teste falha por timeout, investigue se o elemento realmente é renderizado (abra o Trace Viewer).

#### Problema 4: `toHaveText` falha por espaços ou quebras de linha

**Sintoma:** `await expect(celula).toHaveText('8.00')` falha mesmo quando visualmente o valor está correto.

**Causa:** O texto do elemento pode conter espaços extras, `\n` ou `\t` invisíveis.

**Soluções:**

```typescript
// ✅ Usar toContainText para correspondência parcial
await expect(celula).toContainText('8.00');

// ✅ Usar regex para ignorar espaços ao redor
await expect(celula).toHaveText(/\s*8\.00\s*/);

// ✅ Inspecionar o texto real para depuração
const texto = await celula.textContent();
console.log('Texto real:', JSON.stringify(texto));
```

#### Problema 5: Testes interferem entre si

**Sintoma:** Os testes passam quando executados individualmente (`npx playwright test --grep "nome do teste"`), mas falham quando executados juntos.

**Causa:** O site mantém dados em memória (array `alunos`). Se um teste cadastra alunos e o próximo assume que a tabela está vazia, haverá conflito, pois o Playwright abre uma nova página para cada teste — **mas cuidado**: se por algum motivo os testes compartilharem estado (ex: mesma aba), dados do teste anterior podem persistir.

**Soluções:**

```typescript
// ✅ RECOMENDADO — usar beforeEach para garantir estado limpo
test.beforeEach(async ({ page }) => {
  // Cada teste recebe uma nova instância de page (nova aba)
  // Navegar para a página garante estado inicial limpo
  await page.goto('/');
});

// ✅ Se necessário, recarregar a página explicitamente
await page.reload();
```

> **💡 No QS Acadêmico**, como os dados ficam apenas em memória JavaScript (sem banco de dados), cada `page.goto('/')` recarrega a página com o array `alunos` vazio — garantindo isolamento natural.

#### Problema 6: Campo numérico não aceita o valor via `fill()`

**Sintoma:** `page.getByLabel('Nota 1').fill('8')` não preenche o campo, ou o valor fica incorreto.

**Causa:** Em alguns navegadores, campos `<input type="number">` podem ter comportamento diferente com `fill()`.

**Soluções:**

```typescript
// ✅ SOLUÇÃO 1 — limpar o campo antes de preencher
await page.getByLabel('Nota 1').clear();
await page.getByLabel('Nota 1').fill('8');

// ✅ SOLUÇÃO 2 — usar pressSequentially para simular digitação real
await page.getByLabel('Nota 1').pressSequentially('8');

// ✅ SOLUÇÃO 3 — clicar no campo antes de preencher
await page.getByLabel('Nota 1').click();
await page.getByLabel('Nota 1').fill('8');
```

#### Problema 7: `npx playwright test` não encontra os testes

**Sintoma:** O comando executa mas reporta "0 tests found" ou "No tests found".

**Causas e soluções:**

| Causa provável | Solução |
|----------------|---------|
| Arquivo não termina com `.spec.ts` | Renomear para `nome.spec.ts` |
| Arquivo está fora da pasta `tests/` | Mover para a pasta `tests/` ou ajustar `testDir` no config |
| Está executando fora do diretório do projeto | Executar `cd testes-playwright` antes |
| Faltou a função `test()` no arquivo | Verificar se o arquivo importa e usa `test` do `@playwright/test` |

```bash
# Verificar quais testes o Playwright encontra
npx playwright test --list
```

#### Problema 8: Navegadores não instalados

**Sintoma:** Erro `browserType.launch: Executable doesn't exist` ao executar os testes.

**Solução:**

```bash
# Instalar todos os navegadores configurados
npx playwright install

# Ou instalar apenas o Chromium (mais rápido)
npx playwright install chromium
```

#### Resumo Rápido

| Problema | Mensagem típica | Solução principal |
|----------|----------------|-------------------|
| Múltiplos elementos | `strict mode violation` | Restringir escopo com `locator()` ou `{ exact: true }` |
| Texto parcial | Asserção casa com elemento errado | Usar `{ exact: true }` ou restringir ao container |
| Timeout | `Timeout exceeded` | Confiar no auto-retry; verificar no Trace Viewer |
| Espaços invisíveis | `toHaveText` falha | Usar `toContainText` ou regex |
| Testes interferem | Passam isolados, falham juntos | Garantir `page.goto('/')` no `beforeEach` |
| Campo numérico | Valor não preenchido | Usar `clear()` + `fill()` ou `pressSequentially()` |
| 0 testes encontrados | "No tests found" | Verificar nome do arquivo e `testDir` |
| Navegador ausente | `Executable doesn't exist` | Executar `npx playwright install` |

---

## 7. Entregáveis

Cada aluno (ou dupla) deverá entregar:

| Item | Descrição | Formato |
|------|-----------|---------|
| 1 | Fork do repositório com o site publicado no GitHub Pages | Link do GitHub |
| 2 | Projeto Playwright com todos os testes solicitados (`tests/qs-academico.spec.ts` e `tests/qs-academico-codegen.spec.ts`) | Código-fonte no repositório |
| 3 | Screenshot ou PDF do relatório HTML do Playwright mostrando os resultados dos testes (**antes** e **depois** da correção do defeito) | Imagem ou PDF |
| 4 | Registro do defeito encontrado preenchido conforme o modelo da seção 6.5 | PDF ou Markdown |
| 5 | Commit no repositório com a **correção do defeito** no arquivo `docs/js/app.js` | Commit no Git |

---

## 8. Recursos Complementares

Para aprofundamento e consulta:

- **Documentação oficial do Playwright:** [https://playwright.dev/docs/intro](https://playwright.dev/docs/intro)
- **Guia de Locators do Playwright:** [https://playwright.dev/docs/locators](https://playwright.dev/docs/locators)
- **Guia de Asserções do Playwright:** [https://playwright.dev/docs/test-assertions](https://playwright.dev/docs/test-assertions)
- **Playwright Codegen:** [https://playwright.dev/docs/codegen-intro](https://playwright.dev/docs/codegen-intro)
- **Playwright Trace Viewer:** [https://playwright.dev/docs/trace-viewer-intro](https://playwright.dev/docs/trace-viewer-intro)
- **Repositório oficial do Playwright:** [https://github.com/microsoft/playwright](https://github.com/microsoft/playwright)
- **Artigo — Pirâmide de Testes (Martin Fowler):** [https://martinfowler.com/bliki/TestPyramid.html](https://martinfowler.com/bliki/TestPyramid.html)
- **Norma ISO/IEC 25010** — Modelo de qualidade de produto de software

---

