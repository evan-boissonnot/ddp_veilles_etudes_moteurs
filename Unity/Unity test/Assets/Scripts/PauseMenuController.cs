using System.Collections;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using UnityEngine;

public class PauseMenuController : MonoBehaviour
{

    public static bool gameStatus;

    public Button restartButton;
    public Button quitButton;

    // Start is called before the first frame update
    void Start()
    {
        restartButton.onClick.AddListener(delegate () { RestartGame(); });
        quitButton.onClick.AddListener(delegate () { QuitGame(); });
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public static void PauseGame()
    {
        //Time.timeScale = 0;
        if (gameStatus)
        {
            SceneManager.LoadScene("PauseMenu");
            gameStatus = !gameStatus;
            Debug.Log("GameStaus: " + gameStatus);
        }
    }

    public void RestartGame()
    {
        SceneManager.LoadScene("MainScene");
        gameStatus = !gameStatus;
        Debug.Log("GameStaus: " + gameStatus);
    }

    public void QuitGame()
    {
        if (UnityEditor.EditorApplication.isPlaying) { 
            UnityEditor.EditorApplication.isPlaying = false;
        }else { 
            Application.Quit();
        }
    }
}
