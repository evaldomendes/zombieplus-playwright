const {test, expect} = require('../support')

const data = require('../support/fixtures/tvshows.json')
const {executeSQL} = require('../support/database')

test.beforeAll(async () => {
    await executeSQL(`DELETE from tvshows`)
})

test('Deve poder cadastrar uma nova série', async ({page}) => {
    const tvshow = data.create

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.create(tvshow)
    await page.popup.haveText(`A série '${tvshow.title}' foi adicionada ao catálogo.`)
})

test('Deve remover uma série cadastrada', async ({page, request}) => {
    const tvshow = data.to_remove
    await request.api.postTvshow(tvshow)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.remove(tvshow.title)
    await page.popup.haveText(`Série removida com sucesso.`)
})

test('Não deve permitir o cadastro de séries com títulos já existentes', async ({page, request}) => {
    const tvshow = data.duplicate
    await request.api.postTvshow(tvshow)

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.create(tvshow)
    const message = `O título '${tvshow.title}' já consta em nosso catálogo. Por favor, verifique se há necessidade de atualizações ou correções para este item.`
    await page.popup.haveText(message)
})

test('Deve garantir que séries não sejam cadastradas sem os campos obrigatórios preenchidos', async ({page}) => {
    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.goForm()
    await page.tvshows.submit()
    await page.tvshows.alertHaveText([
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório',
        'Campo obrigatório (apenas números)'
    ])
})

test('Deve realizar buscas no sistema por séries que contenham o termo zumbi', async ({page, request}) => {
    const tvshows = data.search

    tvshows.data.forEach(async (m) => {
        await request.api.postTvshow(m)
    })

    await page.login.do('admin@zombieplus.com', 'pwd123', 'Admin')
    await page.tvshows.search(tvshows.input)
    await page.tvshows.tableHave(tvshows.outputs)
})


