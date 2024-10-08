export const Components = {
  Box: [
    { name: '박스', id: 'a1', component: () => import('./MiniBox') },
  ],
  Good: [
    { name: '테스트', id: 'a2', component: () => import('./Test')},
    { name: '칵', id: 'a3', component: () => import('./Good')}
  ]
};