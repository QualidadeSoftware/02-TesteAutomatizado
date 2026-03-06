import { test, expect } from '@playwright/test';

test.describe('QS Acadêmico — Testes do Sistema de Notas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://murilo013.github.io/02-TesteAutomatizado/');
    // Boas práticas: verificar título, seção de cadastro e placeholder do campo
    await expect(page).toHaveTitle(/QS Acadêmico/);
    await expect(page.locator('#secao-cadastro')).toBeVisible();
    await expect(page.getByLabel('Nome do Aluno')).toHaveAttribute(
      'placeholder', 'Digite o nome completo'
    );
    // Verificar que a tabela inicia vazia
    await expect(page.getByText('Nenhum aluno cadastrado.')).toBeVisible();
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
      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(1);
      await expect(page.getByText('João Silva')).toBeVisible();
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

    test('deve rejeitar notas fora do intervalo de 0 a 10', async ({ page }) => {
      const casosInvalidos = [
        { nome: 'Aluno Nota Alta', nota1: '11' },
        { nome: 'Aluno Nota Baixa', nota1: '-1' },
      ];

      for (const caso of casosInvalidos) {
        await page.getByLabel('Nome do Aluno').fill(caso.nome);
        await page.getByLabel('Nota 1').fill(caso.nota1);
        await page.getByLabel('Nota 2').fill('8');
        await page.getByLabel('Nota 3').fill('7');

        await page.getByRole('button', { name: 'Cadastrar' }).click();

        // Com nota inválida, o sistema não deve incluir o aluno na tabela.
        await expect(page.locator('#tabela-alunos tbody td.texto-central')).toBeVisible();
      }
    });

    test('deve filtrar alunos por nome após cadastrar dois alunos', async ({ page }) => {
      // Cadastrar primeiro aluno
      await page.getByLabel('Nome do Aluno').fill('Alice Pereira');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('9');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Cadastrar segundo aluno
      await page.getByLabel('Nome do Aluno').fill('Bruno Silva');
      await page.getByLabel('Nota 1').fill('5');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('7');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Buscar por 'Alice' e verificar que apenas Alice aparece
      await page.getByRole('textbox', { name: 'Buscar por nome' }).fill('Alice');
      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(1);
      await expect(page.getByText('Alice Pereira')).toBeVisible();
      await expect(page.getByText('Bruno Silva')).not.toBeVisible();
    });

    test('deve cadastrar três alunos consecutivos e verificar tabela com 3 linhas', async ({ page }) => {
      const alunos = [
        { nome: 'Aluno1', n1: '7', n2: '8', n3: '6' },
        { nome: 'Aluno2', n1: '5', n2: '6', n3: '7' },
        { nome: 'Aluno3', n1: '9', n2: '9', n3: '10' },
      ];

      for (const a of alunos) {
        await page.getByLabel('Nome do Aluno').fill(a.nome);
        await page.getByLabel('Nota 1').fill(a.n1);
        await page.getByLabel('Nota 2').fill(a.n2);
        await page.getByLabel('Nota 3').fill(a.n3);
        await page.getByRole('button', { name: 'Cadastrar' }).click();
      }

      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(3);
    });

    test('deve contabilizar corretamente as estatísticas (Aprovado, Recuperação, Reprovado)', async ({ page }) => {
      // Aluno Aprovado
      await page.getByLabel('Nome do Aluno').fill('Aluno Aprovado');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('8');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Aluno em Recuperação
      await page.getByLabel('Nome do Aluno').fill('Aluno Recuperacao');
      await page.getByLabel('Nota 1').fill('6');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('6');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Aluno Reprovado
      await page.getByLabel('Nome do Aluno').fill('Aluno Reprovado');
      await page.getByLabel('Nota 1').fill('4');
      await page.getByLabel('Nota 2').fill('4');
      await page.getByLabel('Nota 3').fill('4');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Verificar os cards de estatísticas
      await expect(page.getByText('Total de Alunos')).toContainText('3');
      await expect(page.getByText('Aprovados')).toContainText('1');
      await expect(page.getByText('Recuperação')).toContainText('1');
      await expect(page.getByText('Reprovados')).toContainText('1');
    });

    test('deve excluir um aluno e deixar a tabela vazia novamente', async ({ page }) => {
      // Cadastrar aluno
      await page.getByLabel('Nome do Aluno').fill('Carlos Teste');
      await page.getByLabel('Nota 1').fill('6');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('6');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Verificar que entrou na tabela
      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(1);

      // Clicar no botão de excluir para o aluno criado
      await page.getByRole('button', { name: 'Excluir Carlos Teste' }).click();

      // A tabela deve voltar ao estado vazio
      await expect(page.locator('#tabela-alunos tbody td.texto-central')).toBeVisible();
      // Verificar que o nome não está visível após exclusão
      await expect(page.getByText('Carlos Teste')).not.toBeVisible();
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
      const celulaMedia = page.locator('#tabela-alunos tbody tr td').nth(4);
      await expect(celulaMedia).toHaveText('8.00');
    });

    test('deve marcar situação Aprovado para média maior ou igual a 7', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Aprovado Media');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('7');
      await page.getByLabel('Nota 3').fill('7');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // A célula de situação deve conter 'Aprovado' (coluna após a média)
      const celulaSituacao = page.locator('#tabela-alunos tbody tr td').nth(5);
      await expect(celulaSituacao).toHaveText('Aprovado');
    });

    test('deve marcar situação Reprovado para média menor que 5', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Reprovado Media');
      await page.getByLabel('Nota 1').fill('4');
      await page.getByLabel('Nota 2').fill('4');
      await page.getByLabel('Nota 3').fill('4');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // A célula de situação deve conter 'Reprovado' (coluna após a média)
      const celulaSituacao = page.locator('#tabela-alunos tbody tr td').nth(5);
      await expect(celulaSituacao).toHaveText('Reprovado');
    });

  });
});