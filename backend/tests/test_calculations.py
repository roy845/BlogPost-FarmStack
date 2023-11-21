import pytest

from backend.app.calculations import BankAccount, InsufficientFunds, add, is_divisible_by_5, subtract, multiply, divide


@pytest.fixture
def zero_bank_account():
    return BankAccount()


@pytest.fixture
def bank_account():
    return BankAccount(50)


@pytest.mark.parametrize("num1, num2, res", [(1, 2, 3), (7, 1, 8), (12, 4, 16)])
def test_add(num1, num2, res):
    print("testing add function...")
    assert add(num1, num2) == res


@pytest.mark.parametrize("num1, num2, res", [(1, 2, -1), (7, 1, 6), (12, 4, 8)])
def test_subtract(num1, num2, res):
    assert subtract(num1, num2) == res


@pytest.mark.parametrize("num1, num2, res", [(1, 2, 2), (7, 1, 7), (12, 4, 48)])
def test_multiply(num1, num2, res):
    assert multiply(num1, num2) == res


@pytest.mark.parametrize("num1, num2, res", [(1, 2, 0.5), (7, 1, 7), (12, 4, 3)])
def test_divide(num1, num2, res):
    assert divide(num1, num2) == res


@pytest.mark.parametrize("s, res", [("101", True)])
def test_is_divisible_by_5(s, res):
    assert is_divisible_by_5(s) == res


def test_bank_set_initial_amount(bank_account):
    assert bank_account.balance == 50


def test_bank_set_default_amount(zero_bank_account):
    assert zero_bank_account.balance == 0


def test_withdraw(bank_account):
    bank_account.withdraw(20)
    assert bank_account.balance == 30


def test_deposit(bank_account):
    bank_account.deposit(30)
    assert bank_account.balance == 80


def test_collect_interest(bank_account):
    bank_account.collect_interest()
    assert round(bank_account.balance) == 55


@pytest.mark.parametrize("deposited, withdrew, expected", [(200, 100, 100), (50, 10, 40), (1200, 200, 1000)])
def test_bank_transaction(zero_bank_account, deposited, withdrew, expected):
    zero_bank_account.deposit(deposited)
    zero_bank_account.withdraw(withdrew)
    assert zero_bank_account.balance == expected


def test_insufficient_funds(bank_account):
    with pytest.raises(InsufficientFunds):
        bank_account.withdraw(200)
