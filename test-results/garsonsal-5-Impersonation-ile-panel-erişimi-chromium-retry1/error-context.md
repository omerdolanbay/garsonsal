# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - img "Garsonsal" [ref=e6]
      - paragraph [ref=e7]: İşletme panelinize giriş yapın
    - generic [ref=e8]:
      - generic [ref=e9]:
        - generic [ref=e10]:
          - generic [ref=e11]: E-posta
          - textbox "kafe@example.com" [ref=e12]
        - generic [ref=e13]:
          - generic [ref=e14]: Şifre
          - textbox "••••••••" [ref=e15]
        - button "Giriş Yap →" [ref=e16] [cursor=pointer]
      - paragraph [ref=e17]:
        - text: Hesabınız yok mu?
        - link "Ücretsiz deneyin" [ref=e18] [cursor=pointer]:
          - /url: /kayit
  - alert [ref=e19]
```