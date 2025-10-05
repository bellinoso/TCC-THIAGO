import numpy as np

def dh_transform(alpha, a, d, theta):
    """Retorna a matriz de transformação homogênea A_i para os parâmetros DH fornecidos."""
    alpha, theta = np.radians(alpha), np.radians(theta)
    return np.array([
        [np.cos(theta), -np.sin(theta)*np.cos(alpha),  np.sin(theta)*np.sin(alpha), a*np.cos(theta)],
        [np.sin(theta),  np.cos(theta)*np.cos(alpha), -np.cos(theta)*np.sin(alpha), a*np.sin(theta)],
        [0,              np.sin(alpha),                np.cos(alpha),               d],
        [0,              0,                           0,                           1]
    ])

def forward_kinematics(DH_params):
    """
    Calcula a matriz de transformação global T06 de um braço robótico 6-DOF.
    DH_params: lista de listas [[α1,a1,d1,θ1], ..., [α6,a6,d6,θ6]]
    """
    T = np.eye(4)
    for i, (alpha, a, d, theta) in enumerate(DH_params, start=1):
        A = dh_transform(alpha, a, d, theta)
        T = T @ A
        print(f"\nA{i} =\n{np.round(A, 3)}")  # mostra cada matriz intermediária
    return T

# === Exemplo de uso ===
if __name__ == "__main__":
    # Parâmetros DH (exemplo genérico)
    DH = [
        [90, 100, 330, 20]   # α1, a1, d1, θ1
        ,[0, 400, 0, 100]      # α2, a2, d2, θ2
        ,[-90, 0, 0, 5]      # α3, a3, d3, θ3
        ,[90, 0, 375, 79.20]     # α4, a4, d4, θ4
        ,[-90, 0, 0, 22]      # α5, a5, d5, θ5
        ,[0, 0, 200, 280]         # α6, a6, d6, θ6
    ]

    T06 = forward_kinematics(DH)
    print("\nMatriz de transformação global (T06):")
    np.set_printoptions(precision=2, suppress=True)
    print(T06)

    pos = T06[:3, 3]
    print(f"\nPosição global do efetuador (x, y, z): {np.round(pos, 3)}")

    rot = T06[:3, :3]
    print(f"\nRotação global do efetuador (matriz 3x3):\n{np.round(rot, 3)}")
