using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using UnityEngine;
using System;

public class PlayerController : MonoBehaviour
{
    public float maxSpeed = 2f;

    float moveX;
    float moveY;

    private bool facingLeft = false;
    bool isGrounded;

    private Animator animator;

    private Rigidbody2D rb2d;

    Vector3 Velocity;

    // Start is called before the first frame update
    void Start()
    {
        PauseMenuController.gameStatus = true;
        animator = GetComponent<Animator>();
        rb2d = GetComponent<Rigidbody2D>();
        moveY = rb2d.velocity.y;
    }

    // Update is called once per frame
    void Update()
    {
        float move = Input.GetAxis("Horizontal");

        moveX = move * maxSpeed;
        

        if (Input.GetKeyDown(KeyCode.Space) && isGrounded)
        {
            moveY = 5;
        }
        else
        {
            moveY = rb2d.velocity.y;
        }

        rb2d.velocity = new Vector3(moveX, moveY);

        if (move <= 0.1 && move >= -0.1)
        {
            if (isGrounded)
            {
                ResetRotation();
                animator.Play("idle");
            }
            else
            {
                FreezRotation();
                animator.Play("jump");
            }
        }
        else
        {
            if (isGrounded)
            {
                ResetRotation();
                animator.Play("run");
            }
            else
            {
                FreezRotation();
                animator.Play("jump");
            }
        }

        if (move < 0 && !facingLeft)
        {
            Flip();
        }
        else if (move > 0 && facingLeft)
        {
            Flip();
        }

        if(rb2d.transform.position.y <= -5)
        {
            PauseMenuController.PauseGame();
        }
    }

    void Flip()
    {
        facingLeft = !facingLeft;
        Vector3 scale = transform.localScale;
        scale.x *= -1;
        transform.localScale = scale;
    }

    void FreezRotation()
    {
        rb2d.constraints = RigidbodyConstraints2D.FreezeRotation;
    }

    void ResetRotation()
    {
        rb2d.constraints = RigidbodyConstraints2D.None;
    }


    void OnCollisionEnter2D(Collision2D col)
    {
        if (col.gameObject.tag == "ground")
        {
            Debug.Log("Collision enter");
            isGrounded = true;
        }
    }

    void OnCollisionExit2D(Collision2D col)
    {
        if (col.gameObject.tag == "ground")
        {
            Debug.Log("Collision exit");
            isGrounded = false;
        }
    }
}
