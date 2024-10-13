# ДЗ1

Ссылка на контракты:
erc20 = https://repo.sourcify.dev/contracts/full_match/80002/0x0db39E21982077D178e3d6759a4fEfEA028B8a36/
erc721 = https://repo.sourcify.dev/contracts/full_match/80002/0x6fFe7715445b466f5cC4C6d35cd4F7825B07922B/
erc1155 = https://repo.sourcify.dev/contracts/full_match/80002/0x1cdE56d75a5A7bE8C9224C8E66F562Ea97e9BFF1/

Картинки не отображаются почему то(

<img width="1728" alt="Снимок экрана 2024-10-13 в 20 56 27" src="https://github.com/user-attachments/assets/ace24f7a-6561-4e91-94b2-f3f3b49f6cde">
<img width="1728" alt="Снимок экрана 2024-10-13 в 20 59 04" src="https://github.com/user-attachments/assets/f9c8fb66-c874-4a4f-bfcf-848c64a459bd">


Ответы на вопросы:

1. Что такое функция approve и как она используется?

Функция approve в стандарте ERC20 позволяет владельцу токенов дать разрешение другому адресу (spender) тратить определённое количество его токенов. Она используется вместе с transferFrom, позволяя сторонним контрактам или пользователям переводить токены от имени владельца.

---

2. В чем различие ERC721 и ERC1155?

ERC721 — стандарт для невзаимозаменяемых токенов (NFT), где каждый токен уникален. ERC1155 — мульти-токенный стандарт, поддерживающий как взаимозаменяемые, так и невзаимозаменяемые токены в одном контракте, а также позволяющий выполнять пакетные операции для повышения эффективности.

---

3. Что такое SBT токен?

SBT (Soulbound Token) — это несъёмный токен, привязанный к конкретному адресу или личности, который нельзя передать после выпуска. Он используется для представления персональных достижений, сертификатов или репутационных данных на блокчейне.

---

4. Как можно сделать SBT токен?

Чтобы создать SBT токен, нужно написать смарт-контракт на основе ERC721 или ERC1155, переопределив функции передачи так, чтобы запретить передачу токена после выпуска. Это делает токен несъёмным и навсегда привязывает его к первоначальному владельцу.

