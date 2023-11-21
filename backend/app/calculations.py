def add(num1: int, num2: int) -> int:
    return num1+num2


def subtract(num1: int, num2: int) -> int:
    return num1-num2


def multiply(num1: int, num2: int) -> int:
    return num1*num2


def divide(num1: int, num2: int) -> int:
    return num1/num2


def is_divisible_by_5(s):
    DFA = [
        [0, 1],
        [2, 3],
        [4, 0],
        [1, 2],
        [3, 4],
    ]

    initial_state = 0
    for c in s:
        if c.isdigit() and (int(c) < 0 or int(c) > 1):
            raise ValueError("char must be an integer 0 or 1")

        digit = int(c)
        initial_state = DFA[initial_state][digit]

    return initial_state == 0


class InsufficientFunds(Exception):
    pass


class BankAccount():
    def __init__(self, starting_balance=0):
        self.balance = starting_balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            raise InsufficientFunds("Insufficient funds in account")
        self.balance -= amount

    def collect_interest(self):
        self.balance *= 1.1
