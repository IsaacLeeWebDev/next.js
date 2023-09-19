/* eslint-disable jest/no-standalone-expect */
import { createNextDescribe } from 'e2e-utils'
import { check } from 'next-test-utils'

createNextDescribe(
  'app-dir action useFormState',
  {
    files: __dirname,
    dependencies: {
      react: 'latest',
      'react-dom': 'latest',
    },
  },
  ({ next }) => {
    it('should support submitting form state with JS', async () => {
      const browser = await next.browser('/client/form-state')

      await browser.eval(`document.getElementById('name-input').value = 'test'`)
      await browser.elementByCss('#submit-form').click()

      await check(() => {
        return browser.elementByCss('#form-state').text()
      }, 'initial-state:test')
    })

    it('should support submitting form state without JS', async () => {
      const browser = await next.browser('/client/form-state', {
        disableJavaScript: true,
      })

      await browser.eval(`document.getElementById('name-input').value = 'test'`)
      await browser.elementByCss('#submit-form').click()

      await check(() => {
        return browser.elementByCss('#form-state').text()
      }, 'initial-state:test')

      // It should inline the form state into HTML so it can still be hydrated.
      // Is there a better way to test this? It seems like we can't toggle the
      // disableJavaScript flag after the browser has been created.
      await check(async () => {
        return (await browser.eval('document.body.innerHTML')).includes(
          'self.__next_f.push([2,["initial-state:test"'
        )
          ? 'true'
          : 'false'
      }, 'true')
    })
  }
)
