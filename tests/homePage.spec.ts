import { test, expect } from '@mobilewright/test';

test.describe('General Store homePage', () => {

  test('app launches and shows home screen', async ({ screen, device }) => {
    await expect(screen.getByText('General Store')).toBeVisible();
    await expect(screen.getByText('Select the country where you want to shop')).toBeVisible();
    await expect(screen.getByText('Your Name')).toBeVisible();
    await expect(screen.getByText(/Shop/i)).toBeVisible();
  });

  test('verify gender radio buttons are displayed', async ({ screen, device }) => {
    await expect(screen.getByText('Female')).toBeVisible();
    await expect(screen.getByText('Male')).toBeVisible();
    await screen.getByText('Female').tap();
    await expect(screen.getByText('Female')).toBeVisible();
    await screen.getByText('Male').tap();
    await expect(screen.getByText('Male')).toBeVisible();
  });

  test('enter name in name field', async ({ screen, device }) => {
    await expect(screen.getByText('Your Name')).toBeVisible();
    await screen.getByPlaceholder('Enter name here').fill('John Doe');
    await expect(screen.getByText('John Doe')).toBeVisible();
  });

});
